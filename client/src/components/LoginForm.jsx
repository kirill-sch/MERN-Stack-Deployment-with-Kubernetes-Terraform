// Imports //

import React, { useState, useEffect } from "react"
import CryptoJS from "crypto-js";

// Global Variables //

// Function //

function LoginForm({ setIsLoggedin, setLoggedInUser, setButtonClicked }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordInputType, setPasswordInputType] = useState("password");
    const [showPasswordButtonTextContent, setShowPasswordButtonTextContent] = useState("Show password");
    const [loginError, setLoginError] = useState("");

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
       
        const encryptedPassword = CryptoJS.AES.encrypt(password,'nagyontitkos').toString()

        
        const data =
        {
            username,
            encryptedPassword
    
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
            setLoginError("Incorrect username!")
            setTimeout(() => {
                setLoginError("")
            }, 2300);
        } else if (!validation.succeeded && validation.userFound) {
            setLoginError("Incorrect password!")
            setTimeout(() => {
                setLoginError("")
            }, 2300);
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
            <div className="loginContainer">
                <button className="goBackButton" onClick={() => setButtonClicked("")}>Go back</button>
                <label>
                    {"Username: "}
                    <input
                        type="text"
                        onChange={handleUsernameChange}
                        onKeyDown={handleKeyDown}
                    />
                </label>

                <br />

                <label>
                    {"Password: "}
                    <input
                        type={passwordInputType}
                        onChange={handlePasswordChange}
                        onKeyDown={handleKeyDown}
                    />
                </label>

                <button
                    type="button"
                    onClick={handleShowPassword}
                >
                    {showPasswordButtonTextContent}</button>

                <button
                    type="button"
                    onClick={handleLogin}
                    style={{fontSize:"1.2em", width:"100%"}}
                >Login</button>


                <div className={`errorMessage ${loginError === "" ? 'hidden' : 'active'}`}>
                    <h2>{loginError}</h2>
                </div>

            </div>

        </>
    )
};

export default LoginForm;

