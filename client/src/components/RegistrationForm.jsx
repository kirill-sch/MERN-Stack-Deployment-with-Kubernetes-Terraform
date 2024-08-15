// Imports //

import React, { useState, useEffect, useRef } from "react"
import CryptoJS from "crypto-js";
import Preferences from './Preferences'

// Global Variables //

// Function //

function RegistrationForm({ setButtonClicked }) {

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSendButtonClicked, setIsSendButtonClicked] = useState(false)
    const [profileImageNames, setProfileImageNames] = useState([]);
    const [profilePictureURL, setProfilePictureURL] = useState("/assets/images/default_profiles/default.jpg");
    const [selectedImage, setSelectedImage] = useState(null);
    const [passwordInputType, setPasswordInputType] = useState("password")
    const [errorMessage, setErrorMessage] = useState("")
    const [userPreferences, setUserPreferences] = useState({});

    const hoverSoundRef = useRef(null)
    const clickSoundRef = useRef(null)
    const backSoundRef = useRef(null)
    const profilePictureSoundRef = useRef(null)

    useEffect(() => {
        fetch('/api/images/profiles')
            .then(response => response.json())
            .then(data => setProfileImageNames(data))
            .catch(error => console.error('Error fetching images:', error));
    }, []);


    const handleImageClick = (src) => {
        setProfilePictureURL(src);
        setSelectedImage(src);
        playClickSound()
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

        /*
        // Validate email format
        if (!validateEmail(emailAddress)) {
            alert("Invalid email format!")
            return
        }
        */
        const encryptedPassword = CryptoJS.AES.encrypt(password,'>+KtIM"?t#71m1rtIbF>').toString();

        const baseStat = (Math.floor(Math.random() * (35 - 15 + 1)) + 15);

        userPreferences.gender.push("??");

        const userData =
        {
            firstName: firstname,
            lastName: lastname,
            email: emailAddress,
            username: username,
            password: encryptedPassword,
            profilePicture: profilePictureURL,
            baseStat: baseStat,
            lastFrontCard: {null: null},
            userPreferences: updatedUserPreferences
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

            delete userData.password;
            console.log(userData);


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

        playClickSound()
    }


    // Play the sound effects
    function playHoverSound() {
        if (hoverSoundRef.current) {
            hoverSoundRef.current.currentTime = 0
            hoverSoundRef.current.play().catch((error) => {
                console.error("Play failed:", error)
            })
        }
    }

    function playClickSound() {
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0
            clickSoundRef.current.play().catch((error) => {
                console.error("Play failed:", error)
            })
        }
    }

    function playBackSound() {
        if (backSoundRef.current) {
            backSoundRef.current.currentTime = 0
            backSoundRef.current.play().catch((error) => {
                console.error("Play failed:", error)
            })
        }
    }

    function playProfilePictureSound() {
        if (profilePictureSoundRef.current) {
            profilePictureSoundRef.current.currentTime = 0
            profilePictureSoundRef.current.play().catch((error) => {
                console.error("Play failed:", error)
            })
        }
    }



    return (

        <>

            <audio ref={hoverSoundRef} src="/assets/sounds/soundeffect5.mp3" />
            <audio ref={clickSoundRef} src="/assets/sounds/soundeffect1.mp3" />
            <audio ref={backSoundRef} src="/assets/sounds/soundeffect3.mp3" />
            <audio ref={profilePictureSoundRef} src="/assets/sounds/soundeffect3.mp3"/>


            {!isSendButtonClicked ? (

                <div className="regContainer">
                    <button className="goBackButton" onClick={() => setButtonClicked("")} onMouseOver={playHoverSound}>Go back</button>
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
                            onMouseOver={playHoverSound}
                        >
                            {passwordInputType === "password" ? "Show password" : "Hide password"}</button>

                        <button type="submit" onMouseOver={playHoverSound} style={{fontSize:"1.2em" ,width:"100%"}}>Register</button>

                    </form>

                    <Preferences setUserPreferences={setUserPreferences} />

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
                                    onMouseOver={playProfilePictureSound}
                                />
                            )
                        })}
                    </div>}

                    <div className={`errorMessage ${errorMessage === "" ? 'hidden' : 'active'}`}>
                        <h2>{errorMessage}</h2>
                    </div>

                </div>

            ) : (

                <div className="welcomeDiv">

                    <h1>Thank you for your registration!</h1>
                    <div className="buttonWrapper">

                    <button style={{fontSize:"2em"}} onClick={() => setButtonClicked("login")}>Click here to login!</button>
                    </div>
  

                </div>

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

