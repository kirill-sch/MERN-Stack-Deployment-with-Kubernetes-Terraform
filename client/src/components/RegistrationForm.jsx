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
            firstname: firstname,
            lastname: lastname,
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
                throw new Error("Response is not ok in the body of handleSumbit()!")
            }

            console.log("Registration was successfull!")
            console.log(userData)

        } catch (error) {
            console.error("handleSubmit() catch error", error)
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
                                type="password"
                                placeholder="password..."
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
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

