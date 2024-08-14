import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import Signup_Login from './pages/Signup_Login'

function App() {

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [profilePictureURL, setProfilePictureURL] = useState("/assets/images/default_profiles/profile1.webp");

  return (
    <>
    {isLoggedin ? <HomePage profilePictureURL={profilePictureURL}/> : <Signup_Login />}
    </>
  )
}

export default App
