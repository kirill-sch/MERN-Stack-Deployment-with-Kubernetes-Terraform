import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import Signup_Login from './pages/Signup_Login'

function App() {

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null)

  return (
    <>
    {isLoggedin ? <HomePage /> : <Signup_Login />}
    </>
  )
}

export default App
