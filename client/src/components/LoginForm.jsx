// Imports //

import React, { useState, useEffect } from "react"

// Global Variables //

// Function //

function LoginForm({setIsLoggedin, setLoggedInUser}) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordInputType, setPasswordInputType] = useState("password")
    const [showPasswordButtonTextContent, setShowPasswordButtonTextContent] = useState("Show password")

    // Handle Username Inputfield
    function handleUsernameChange(event) {
        const userInput = event.target.value
        setUsername(userInput)
    }

    // Handle Password Inputfield
    function handlePasswordChange(event) {
        const userInput = event.target.value
        setPassword(userInput)
    }

    // Handle Login Button
    async function handleLogin() {
        /*
        if (username.length === 0) {
            alert ("Please, type your username!")
        } else if (password.length === 0) {
            alert ("Please type your password!")
        } else {
            setIsLoggedin(true)
        }
        */

        const data =
        {
            username,
            password
        }

        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const validation = await response.json()

        if (validation.userFound && validation.succeeded) {
            console.log("Logged in: ", validation.user);
            setLoggedInUser(validation.user);
            setIsLoggedin(true)
        } else if (!validation.userFound) {
            alert("Incorrect username!")
        } else if (!validation.succeeded && validation.userFound) {
            alert("Incorrect password!")
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

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <>
                <div className="login">
                    <label>
                        {"Username: "}
                        <input
                            type="text"
                            placeholder="type your username here..."
                            onChange={handleUsernameChange}
                            onKeyDown={handleKeyDown}
                        />
                    </label>

                    <br />

                    <label>
                        {"Password: "}
                        <input
                            type={passwordInputType}
                            placeholder="type your password here..."
                            onChange={handlePasswordChange}
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            type="button"
                            onClick={handleShowPassword}
                        >
                        {showPasswordButtonTextContent}</button>

                    </label>

                    <br />

                    <button
                        type="button"
                        onClick={handleLogin}
                    >Login</button>

                </div>

        </>
    )
};

export default LoginForm;

