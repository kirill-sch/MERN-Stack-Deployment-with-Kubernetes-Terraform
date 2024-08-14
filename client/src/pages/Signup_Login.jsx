// Imports //

import React, { useState, useEffect } from "react"
import LoginForm from "../components/LoginForm"
import RegistrationForm from "../components/RegistrationForm";

// Function //

function Signup_Login({ setIsLoggedin, setLoggedInUser }) {

    const [buttonClicked, setButtonClicked] = useState("")
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(false);

    const images = [
        '/assets/images/welcome_screens/welcome1.jpg',
        '/assets/images/welcome_screens/welcome2.jpg',
        '/assets/images/welcome_screens/welcome3.jpg',
        '/assets/images/welcome_screens/welcome4.jpg',
        '/assets/images/welcome_screens/welcome5.jpg',
        '/assets/images/welcome_screens/welcome6.jpg'
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setCurrentImageIndex((currentImageIndex + 1) % images.length);
                setFade(false);
            }, 2000); // 2 seconds for fade out
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [currentImageIndex, images.length]);

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
                            backgroundImage: `url(${images[currentImageIndex]})`,
                            opacity: fade ? 0 : 1,
                        }}
                    />
                </div>
                </div>
            }

            {buttonClicked === "login" &&
                <LoginForm setIsLoggedin={setIsLoggedin} setLoggedInUser={setLoggedInUser} setButtonClicked={setButtonClicked} />
            }

            {buttonClicked === "signup" &&
                <RegistrationForm setLoggedInUser={setLoggedInUser} setButtonClicked={setButtonClicked} />
            }

        </>
    )
};

export default Signup_Login;

