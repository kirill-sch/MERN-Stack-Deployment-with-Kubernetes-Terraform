import { useEffect, useState, useRef} from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import Signup_Login from './pages/Signup_Login'

function App() {

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

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
      <audio ref={hoverSoundRef} src="/assets/sounds/soundeffect5.mp3" />
      <audio ref={clickSoundRef} src="/assets/sounds/soundeffect1.mp3" />
      <audio ref={backSoundRef} src="/assets/sounds/soundeffect2.mp3" />
      <audio ref={feedbackSoundRef} src="/assets/sounds/soundeffect3.mp3" />
      <audio ref={matchSoundRef} src="/assets/sounds/soundeffect6.mp3" />

      {isLoggedin && loggedInUser ? <HomePage setIsLoggedin={setIsLoggedin} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} playMatchSound={playMatchSound}/> : <Signup_Login setIsLoggedin={setIsLoggedin} setLoggedInUser={setLoggedInUser} playFeedbackSound={playFeedbackSound} playClickSound={playClickSound}/>}
    </>
  )
}

export default App
