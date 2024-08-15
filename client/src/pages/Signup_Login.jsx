// Imports //

import React, { useState, useEffect, useRef } from "react"
import LoginForm from "../components/LoginForm"
import RegistrationForm from "../components/RegistrationForm";

// Function //

function Signup_Login({ setIsLoggedin, setLoggedInUser }) {

    const [buttonClicked, setButtonClicked] = useState("")
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(false);
    const [welcomeImages, setWelcomeImages] = useState([]);

    const hoverSoundRef = useRef(null)
    const clickSoundRef = useRef(null)
    const backSoundRef = useRef(null)


    useEffect(() => {
        fetch('/api/images/welcome')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log to check if the URLs are correct
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
            <audio ref={clickSoundRef} src="/assets/sounds/soundeffect2.mp3" />
            <audio ref={backSoundRef} src="/assets/sounds/soundeffect3.mp3" />


            {buttonClicked === "" &&
            <div className="welcomeContainer">
                <div className="welcomeDiv">
                    <h1>Welcome to Finder!</h1>
                    <h3>Finder (Fantasy Finder™) is a dating app based on the hit fantasy anthology media franchise Final Fantasy.</h3>
                    <div className="welcomeButtons">

                        <button
                            onClick={() => setButtonClicked("signup")}
                            onMouseOver={playHoverSound}
                        >Sign up</button>
                        <button
                            onClick={() => setButtonClicked("login")}
                            onMouseOver={playHoverSound}
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
                <LoginForm setIsLoggedin={setIsLoggedin} setLoggedInUser={setLoggedInUser} setButtonClicked={setButtonClicked} />
            }

            {buttonClicked === "signup" &&
                <RegistrationForm setLoggedInUser={setLoggedInUser} setButtonClicked={setButtonClicked} />
            }

        </>
    )
};

export default Signup_Login;

