import { useEffect, useState, useRef } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import Signup_Login from './pages/Signup_Login'

function App() {

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);


  const localUserId = localStorage.getItem('loggedInUserLocalId');

  //Sounds
  const hoverSoundRef = useRef(null)
  const clickSoundRef = useRef(null)
  const backSoundRef = useRef(null)
  const feedbackSoundRef = useRef(null)
  const matchSoundRef = useRef(null)

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

  function playFeedbackSound() {
    if (feedbackSoundRef.current) {
      feedbackSoundRef.current.currentTime = 0
      feedbackSoundRef.current.play().catch((error) => {
        console.error("Play failed:", error)
      })
    }
  }

  function playMatchSound() {
    if (matchSoundRef.current) {
      matchSoundRef.current.currentTime = 0
      matchSoundRef.current.play().catch((error) => {
        console.error("Play failed:", error)
      })
    }
  }



  async function fetchUserDetails(id) {

    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }


      const user = await response.json();

      delete user.password
      delete user.email

      console.log("Fetched user:", user);

      return user;

    } catch (error) {

      console.log(error);
    }
  }


  // Load logged-in user ID from local storage on component mount
  useEffect(() => {

    if (localUserId) {

      setLoggedInUserId(JSON.parse(localUserId));
    }
  }, []);


  // Login / logout
  useEffect(() => {

    const fetchAndSetUser = async () => {

      if (loggedInUserId) {

        const user = await fetchUserDetails(loggedInUserId);
        console.log("useEffect user", user);

        if (!localUserId) {
          localStorage.setItem('loggedInUserLocalId', JSON.stringify(loggedInUserId));
        }

        setLoggedInUser(user);
        setIsLoggedin(true);

      }

      else {

        localStorage.removeItem('loggedInUserLocalId');
        setLoggedInUser(null);
        setIsLoggedin(false);
      }
    };

    fetchAndSetUser();

  }, [loggedInUserId]);

  return (
    <>
      <audio ref={hoverSoundRef} src="/assets/sounds/soundeffect5.mp3" />
      <audio ref={clickSoundRef} src="/assets/sounds/soundeffect1.mp3" />
      <audio ref={backSoundRef} src="/assets/sounds/soundeffect2.mp3" />
      <audio ref={feedbackSoundRef} src="/assets/sounds/soundeffect3.mp3" />
      <audio ref={matchSoundRef} src="/assets/sounds/soundeffect6.mp3" />

      {loggedInUserId  && isLoggedin ? <HomePage loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} playMatchSound={playMatchSound} setLoggedInUserId={setLoggedInUserId}/> : <Signup_Login setLoggedInUserId={setLoggedInUserId} playFeedbackSound={playFeedbackSound} playClickSound={playClickSound} />}
    </>
  )
}

export default App
