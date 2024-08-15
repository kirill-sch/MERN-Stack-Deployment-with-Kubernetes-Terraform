// Imports //

import React, { useState, useEffect } from "react"
import Preferences from './Preferences'

// Global Variables //

// Function //

function RegistrationForm({ setLoggedInUser , setButtonClicked}) {

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSendButtonClicked, setIsSendButtonClicked] = useState(false)
    const [profileImageNames, setProfileImageNames] = useState([]);
    const [profilePictureURL, setProfilePictureURL] = useState("/assets/images/default_profiles/profile1.webp");
    const [selectedImage, setSelectedImage] = useState(null);
    const [passwordInputType, setPasswordInputType] = useState("password")
    const [errorMessage, setErrorMessage] = useState("")
    const [userPreferences, setUserPreferences] = useState({});

    useEffect(() => {
        fetch('/api/images/profiles')
            .then(response => response.json())
            .then(data => setProfileImageNames(data))
            .catch(error => console.error('Error fetching images:', error));
    }, []);


    const handleImageClick = (src) => {
        setProfilePictureURL(src);
        setSelectedImage(src);
    };

    // Email validation if we have already an emailAddress
    function validateEmail(emailAddress) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(emailAddress)
    }


    // Handle Send Button
    async function handleSubmit(event) {
        event.preventDefault()

        if (!firstname || !lastname || !emailAddress || !username || !password) {
            if (!firstname) {
                alert("Firstname field is empty!")
                return
            } else if (!lastname) {
                alert("Lastname field is empty!")
                return
            } else if (!emailAddress) {
                alert("Email address field is empty!")
                return
            } else if (!username) {
                alert("Username field is empty!")
                return
            } else if (!password) {
                alert("Password field is empty!")
                return
            }
        }


        // Validate email format
        if (!validateEmail(emailAddress)) {
            alert("Invalid email format!")
            return
        }

        const userData =
        {
            firstName: firstname,
            lastName: lastname,
            email: emailAddress,
            username: username,
            password: password,
            profilePicture: profilePictureURL,
            userPreferences: userPreferences
        }

        console.log(userData);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {

                const errorData = await response.json()
                console.log(errorData)

                if (errorData.error_message) {
                    setErrorMessage(errorData.error_message);

                    setTimeout(() => {
                        setErrorMessage("")
                    }, 2300);
                } else {
                    setErrorMessage('An unexpected error occurred.');
                }
                return;
            }

            console.log("Registration was successfull!")
            console.log(userData)
            setLoggedInUser(userData);
            setIsSendButtonClicked(true);

        } catch (error) {
            console.error("handleSubmit() catch error", error)
            setErrorMessage('An error occurred while processing your request.');
        }
    }

    // Handle Show Password (Show or Hide the password)
    function handleShowPassword() {

        if (passwordInputType === "password") {
            setPasswordInputType("text")
        } else {
            setPasswordInputType("password")
        }
    }

    return (

        <>


            {!isSendButtonClicked ? (

                <div className="regContainer">
                                <button className="goBackButton" onClick={() => setButtonClicked("")}>Go back</button>
                    <form className="registrationForm" onSubmit={handleSubmit}>
                        <label>
                            {"First Name: "}
                            <input
                                type="text"
                                value={firstname}
                                onChange={(event) => setFirstname(event.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            {"Last Name: "}
                            <input
                                type="text"
                                value={lastname}
                                onChange={(event) => setLastname(event.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            {"Email Address: "}
                            <input
                                type="text"
                                value={emailAddress}
                                onChange={(event) => setEmailAddress(event.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            {"Username: "}
                            <input
                                type="text"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            {"Password: "}
                            <input
                                minLength="8"
                                type={passwordInputType}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleShowPassword}
                        >
                            {passwordInputType === "password" ? "Show password" : "Hide password"}</button>

                        <button type="submit">Register</button>

                    </form>

                    <Preferences setUserPreferences={setUserPreferences}/>

                    {profileImageNames && <div className="profileimagesDiv">
                        <a style={{ margin: '10px' }}>Choose a profile picture:</a>
                        {profileImageNames.map((imageName, index) => {
                            const src = `/assets/images/default_profiles/${imageName}`
                            const isSelected = src === selectedImage;

                            return (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Profile ${index + 1}`}
                                    onClick={() => handleImageClick(src)}
                                    className={isSelected ? 'active' : ''}
                                />
                            )
                        })}
                    </div>}

                    <div className={`errorMessage ${errorMessage === "" ? 'hidden' : 'active'}`}>
                            <h2>{errorMessage}</h2>
                        </div>

                </div>

            ) : (
                <p>Regisztráció elküldve!</p>
            )}

        </>
    )
}

// Export //

export default RegistrationForm



/*
a form részei:

firstname
lastname
email
username
password
*/

