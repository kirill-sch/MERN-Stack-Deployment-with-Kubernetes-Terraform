// Imports //

import React, { useState, useEffect } from "react"

// Global Variables //

const validUsername = "sanyi"
const validPassword = "asd"

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
    function handleLogin() {
        if (username.length === 0) {
            alert ("Please, type your username!")
        } else if (password.length === 0) {
            alert ("Please type your password!")
        } else if (username !== validUsername || password !== validPassword) {
            alert ("Incorrect username or password!")
        } else {
            setIsLoggedIn(true)
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
                <p>Be vagy jelentkezve!</p>
            )}

        </div>
    )
};

export default LoginForm;

