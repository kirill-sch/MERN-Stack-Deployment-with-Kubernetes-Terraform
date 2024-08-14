// Imports //

import React, { useState, useEffect } from "react"
import LoginForm from "../components/LoginForm"
import RegistrationForm from "../components/RegistrationForm";

// Function //

function Signup_Login() {

    const [buttonClicked, setButtonClicked] = useState("")

    return (
        <>
            {buttonClicked === "" &&
                <div>
                    <button
                        onClick={() => setButtonClicked("signup")}
                    >Sign up</button>
                    <button
                        onClick={() => setButtonClicked("login")}
                    >Log in</button>
                </div>
            }

            {buttonClicked === "login" &&
                <LoginForm/>
            }

            {buttonClicked === "signup" &&
                <RegistrationForm/>
            }

        </>
    )
};

export default Signup_Login;

