// Imports //

import React, { useState, useEffect } from "react"

// Global Variables //

// Function //

function RegistrationForm() {

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSendButtonClicked, setIsSendButtonClicked] = useState(false)
    const [passwordInputType, setPasswordInputType] = useState("password")
    const [showPasswordButtonTextContent, setShowPasswordButtonTextContent] = useState("Show password")
    const [alreadyExistsMessage, setAlreadyExistsMessage] = useState("")



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

        setIsSendButtonClicked(true)

        const userData =
        {
            firstName: firstname,
            lastName: lastname,
            email: emailAddress,
            username: username,
            password: password
        }

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {

                const errorData = await response.json()
                console.log(errorData)

                if (errorData.error_message === "Username already exists!") {
                    console.log("username already exists: ", userData.username)
                    setAlreadyExistsMessage(errorData.error_message)
                    alert(alreadyExistsMessage)
                } else if (errorData.error_message === "Email address already registered!") {
                    console.log("email address already exists: ", userData.email)
                    setAlreadyExistsMessage(errorData.error_message)
                    alert(alreadyExistsMessage)
                }
            }

            console.log("Registration was successfull!")
            console.log(userData)

        } catch (error) {
            console.error("handleSubmit() catch error", error)
        }
    }

    // Handle Show Password (Show or Hide the password)
    function handleShowPassword() {

        if (passwordInputType === "password") {
            setPasswordInputType("text")
            setShowPasswordButtonTextContent("Hide password")
        } else {
            setPasswordInputType("password")
            setShowPasswordButtonTextContent("Show password")
        }
    }

    return (

        <div>

            {!isSendButtonClicked ? (

                <div className="registration">

                    <form className="registrationForm" onSubmit={handleSubmit}>
                        <label>
                            {"First Name: "}
                            <input
                                type="text"
                                placeholder="first name..."
                                value={firstname}
                                onChange={(event) => setFirstname(event.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            {"Last Name: "}
                            <input
                                type="text"
                                placeholder="last name..."
                                value={lastname}
                                onChange={(event) => setLastname(event.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            {"Email Address: "}
                            <input
                                type="text"
                                placeholder="email address..."
                                value={emailAddress}
                                onChange={(event) => setEmailAddress(event.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            {"Username: "}
                            <input
                                type="text"
                                placeholder="username..."
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
                                placeholder="password..."
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />

                            <button
                                type="button"
                                onClick={handleShowPassword}
                            >
                                {showPasswordButtonTextContent}</button>

                        </label>

                        <br />

                        <button type="submit">Send</button>

                    </form>

                </div>

            ) : (
                <p>Regisztráció elküldve!</p>
            )}

        </div>
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

