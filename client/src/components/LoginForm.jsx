// Imports //

import React, { useState, useEffect } from "react"
import HomePage from "../pages/HomePage"

// Global Variables //

// Function //

function LoginForm() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

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
            setIsLoggedIn(true)
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
            setIsLoggedIn(true)
        } else if (!validation.userFound) {
            alert("Incorrect username!")
        } else if (!validation.succeeded && validation.userFound) {
            alert("Incorrect password!")
        }
    }
    
    return (
        <div>

            {!isLoggedIn ? (
                <div className="login">
                    <label>
                        {"Username: "}
                        <input
                            type="text"
                            placeholder="type your username here..."
                            onChange={handleUsernameChange}
                        />
                    </label>

                    <br />

                    <label>
                        {"Password: "}
                        <input
                            type="password"
                            placeholder="type your password here..."
                            onChange={handlePasswordChange}
                        />
                    </label>

                    <br/>

                    <button
                        type="button"
                        onClick={handleLogin}
                    >Login</button>

                </div>
            ) : (
                <HomePage/>
            )}

        </div>
    )
};

export default LoginForm;

