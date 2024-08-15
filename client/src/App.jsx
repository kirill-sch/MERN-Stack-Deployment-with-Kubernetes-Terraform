import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import Signup_Login from './pages/Signup_Login'

function App() {

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);


  // Load logged-in user from local storage on component mount
  useEffect(() => {

    const localUser = localStorage.getItem('loggedInUserLocal');
    if (localUser) {

      setLoggedInUser(JSON.parse(localUser)); 
      setIsLoggedin(true);

    }
  }, []); 


  // Save logged-in user to local storage whenever it changes
  useEffect(() => {

    if (loggedInUser) {

      localStorage.setItem('loggedInUserLocal', JSON.stringify(loggedInUser)); 
      setIsLoggedin(true);

    } 
    
    else {

      localStorage.removeItem('loggedInUserLocal');
      setIsLoggedin(false);
    }
  }, [loggedInUser]); 

  console.log(loggedInUser);

  return (
    <>
      {isLoggedin ? <HomePage setIsLoggedin={setIsLoggedin} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/> : <Signup_Login setIsLoggedin={setIsLoggedin} setLoggedInUser={setLoggedInUser} />}
    </>
  )
}

export default App
