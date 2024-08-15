// Imports //

import React, { useState, useEffect, useRef } from "react"
import CryptoJS from "crypto-js";

// Global Variables //

// Function //

function LoginForm({ setIsLoggedin, setLoggedInUser, setButtonClicked }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordInputType, setPasswordInputType] = useState("password");
    const [showPasswordButtonTextContent, setShowPasswordButtonTextContent] = useState("Show password");
    const [loginError, setLoginError] = useState("");

    const hoverSoundRef = useRef(null)
    const clickSoundRef = useRef(null)
    const backSoundRef = useRef(null)

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
       
        const encryptedPassword = CryptoJS.AES.encrypt(password,'>+KtIM"?t#71m1rtIbF>').toString()


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

            delete validation.user.password;
            delete validation.user.email;

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

        playClickSound()
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

        playClickSound()
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    


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



    return (
        <>

            <audio ref={hoverSoundRef} src="/assets/sounds/soundeffect5.mp3" />
            <audio ref={clickSoundRef} src="/assets/sounds/soundeffect1.mp3" />
            <audio ref={backSoundRef} src="/assets/sounds/soundeffect3.mp3" />

            <div className="loginContainer">
                <button className="goBackButton" onClick={() => setButtonClicked("")} onMouseOver={playHoverSound}>Go back</button>
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
                    onMouseOver={playHoverSound}
                >
                    {showPasswordButtonTextContent}</button>

                <button
                    type="button"
                    onClick={handleLogin}
                    onMouseOver={playHoverSound}
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

