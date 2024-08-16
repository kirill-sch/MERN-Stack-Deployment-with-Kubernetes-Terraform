// Imports //

import React, { useState, useEffect, useRef } from "react"
import LoginForm from "../components/LoginForm"
import RegistrationForm from "../components/RegistrationForm";

// Function //

function Signup_Login({ setLoggedInUserId , playFeedbackSound, playClickSound}) {

    const [buttonClicked, setButtonClicked] = useState("")
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(false);
    const [welcomeImages, setWelcomeImages] = useState([]);

    useEffect(() => {
        fetch('/api/images/welcome')
            .then(response => response.json())
            .then(data => {
                setWelcomeImages(data);
            })
            .catch(error => console.error('Error fetching images:', error));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setCurrentImageIndex((currentImageIndex + 1) % welcomeImages.length);
                setFade(false);
            }, 2000); // 2 seconds for fade out
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [currentImageIndex, welcomeImages.length]);


    return (
        <>

            {buttonClicked === "" &&
            <div className="welcomeContainer">
                <div className="welcomeDiv">
                    <h1>Welcome to Finder!</h1>
                    <h3>Finder (Fantasy Finder™) is a dating app based on the hit fantasy anthology media franchise Final Fantasy.</h3>
                    <div className="welcomeButtons">

                        <button
                            onClick={() => setButtonClicked("signup")}
                        >Sign up</button>
                        <button
                            onClick={() => setButtonClicked("login")}
                        >Log in</button>
                    </div>
                    <div
                        className="background-layer"
                        style={{
                            backgroundImage: `url(${welcomeImages[currentImageIndex]})`,
                            opacity: fade ? 0 : 1,
                        }}
                    />
                </div>
                </div>
            }

            {buttonClicked === "login" &&
                <LoginForm setLoggedInUserId={setLoggedInUserId} setButtonClicked={setButtonClicked} playFeedbackSound={playFeedbackSound}/>
            }

            {buttonClicked === "signup" &&
                <RegistrationForm setButtonClicked={setButtonClicked} playFeedbackSound={playFeedbackSound} playClickSound={playClickSound}/>
            }

        </>
    )
};

export default Signup_Login;

