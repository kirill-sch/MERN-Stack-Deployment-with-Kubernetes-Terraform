// Imports //

import React, { useState, useEffect, useRef } from "react"
import ArrowIcon from "./ArrowIcon"
import MatchNotification from "./MatchNotification"

// Global Variables //

//const CHARACTERS_API = "https://www.moogleapi.com/api/v1/characters/"

// Function //

function Main({ setLoggedInUser, loggedInUser, setIsLoading, setMatched, setUserUpdates, playMatchSound }) {

    const [characters, setCharacters] = useState([])
    const [backRandomCharacter, setBackRandomCharacter] = useState(null);
    const [frontRandomCharacter, setFrontRandomCharacter] = useState(null)
    const [isMoreDetailsVisible, setIsMoreDetailsVisible] = useState(false);
    const [matchBonus, setMatchBonus] = useState(0)
    const [penalty, setPenalty] = useState(0);
    const [isMatchNotificationVisible, setIsMatchNotificationVisible] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const [isGameOver, setIsGameOver] = useState(false);

    const gameOver = {
        _id: "",
        age: "??",
        description: "No more characters :(",
        gender: "",
        height: "",
        id: "",
        japaneseName: "",
        job: "",
        name: "Game Over",
        origin: "??",
        pictures: [{ url: "/assets/images/gameover.png" }],
        race: "??",
        stats: [],
        weight: ""

    }


    useEffect(() => {

        async function fetchCharacters() {
            try {
                const response = await fetch('/api/characters/4', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loggedInUser)
                })

                if (!response.ok) {
                    throw new Error("Response is not ok in the body of the fetchCharacters()!")
                }

                const fetchedCharacters = await response.json();

                if (fetchedCharacters.length < 2) {

                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1600);

                    //Don't try to fill backRandomCharacter, when there is only one character left.
                    //Also, make GAME OVER card when there aren't any characters left.


                    if (fetchedCharacters.length < 1) {

                        setFrontRandomCharacter(gameOver)
                        setIsGameOver(true)
                        return
                    };

                    setFrontRandomCharacter(fetchedCharacters[0])
                    setBackRandomCharacter(gameOver)
                    return
                }

                console.log("fetchedCharacters: ", fetchedCharacters)

                const lastFrontCardOnline = loggedInUser.lastFrontCard;

                const localUserSave = JSON.parse(localStorage.getItem('loggedInUserLocal'));
                const lastFrontCardLocal = localUserSave.lastFrontCard;

                if (lastFrontCardOnline._id) {
                    //Save to local storage only
                    setFrontRandomCharacter(lastFrontCardOnline)
                    setLoggedInUser({ ...loggedInUser, lastFrontCard: lastFrontCardOnline });
                }

                else if (lastFrontCardOnline.null && lastFrontCardLocal) {
                    //Save to DB only
                    setFrontRandomCharacter(lastFrontCardLocal);
                    setUserUpdates({ ...loggedInUser, lastFrontCard: lastFrontCardLocal })

                }

                else {
                    //Save to DB and local storage
                    setUserUpdates({ ...loggedInUser, lastFrontCard: fetchedCharacters[0] });
                    setLoggedInUser({ ...loggedInUser, lastFrontCard: fetchedCharacters[0] });

                    setFrontRandomCharacter(fetchedCharacters[0])
                }


                setBackRandomCharacter(fetchedCharacters[1])
                setCharacters(fetchedCharacters.slice(2))

                setTimeout(() => {
                    setIsLoading(false)
                }, 1600);

                console.log("Characters fetched successfully!")

            } catch (error) {
                console.error("fetchCharacters() fetch error", error)
            }
        }

        fetchCharacters()

    }, [])

    const putCharactersInStates = async () => {

        if (characters.length < 1) {

            setFrontRandomCharacter(gameOver)
            setCharacters(gameOver);
            return;
        }

        else {

        setFrontRandomCharacter(backRandomCharacter);

        console.log("front character:", frontRandomCharacter);
        console.log("back character: ", backRandomCharacter);
        console.log("characters:", characters);

        //Save to DB and local storage
        setUserUpdates({ ...loggedInUser, lastFrontCard: backRandomCharacter });
        setLoggedInUser({ ...loggedInUser, lastFrontCard: backRandomCharacter });

   

      

            setBackRandomCharacter(characters[0]);
            setCharacters(characters.slice(1));
            let newCharacter = null;
            let attempts = 0;

            while (attempts < 10) {
                attempts += 1;
                console.log(attempts);

                try {
                    const response = await fetch('/api/characters/1', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(loggedInUser)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch new character.');
                    }

                    newCharacter = await response.json();
                    newCharacter = newCharacter[0];
                    console.log("newCharacter:", newCharacter);

                    // Assuming that each character has a unique "id" property
                    const isDuplicateInCharacters = characters.some(character => character.id === newCharacter.id);
                    const isDuplicateInBackRandom = backRandomCharacter && backRandomCharacter.id === newCharacter.id;
                    const isDuplicateInFrontRandom = frontRandomCharacter && frontRandomCharacter.id === newCharacter.id;

                    if (!isDuplicateInCharacters && !isDuplicateInBackRandom && !isDuplicateInFrontRandom) {
                        break;  // Exit the loop if the character is unique across all states
                    }

                    else{
                        console.log("Duplicate character found, retrying...");
                    }

                } catch (error) {
                    console.error('Error fetching character:', error);
                    return; // Exit if an error occurs to prevent an infinite loop
                }

                if (attempts === 10) {
                    console.log("No unique characters found after max attempts.");
                    return;
                }

            };

            // Add the new, unique character to the state
            setCharacters(prevCharacters => [...prevCharacters, newCharacter]);
        }
    }


    /* useEffect(() => {

        function getRandomIndex() {

            if (characters.length > 0) {
                const randomIndex = Math.floor(Math.random() * characters.length)
                const randomGeneratedCharacter = characters[randomIndex]
                console.log(randomGeneratedCharacter)
                setFrontRandomCharacter(randomGeneratedCharacter)
                
                setTimeout(() => {
                    setIsLoading(false)
                }, 1600);
            }
        }

        getRandomIndex()

    }, [characters]) */

    const handleLike = async () => {
        const likedCharacterId = frontRandomCharacter.id;
        const likedBy = loggedInUser.username;
        const data = { likedBy, likedCharacterId };
        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const stats = ((loggedInUser.baseStat - penalty) + matchBonus)      //Add penalty to User Schema!
            
            const isMatch = Math.random() < stats / 100;
            console.log("stats", stats);

            isMatch ? matchHappened() : setMatchBonus(matchBonus + 5);
            putCharactersInStates();

        } catch (e) {
            console.error(e);
        }

        //playLikeSound()
    }

    const handleDislike = async () => {
        const dislikedCharacterId = frontRandomCharacter.id;
        const dislikedBy = loggedInUser.username;
        const data = { dislikedBy, dislikedCharacterId }
        try {
            const response = await fetch('/api/dislikes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            console.log(await response.json())
            putCharactersInStates();
        } catch (e) {
            console.error(e);
        }

        //playDislikeSound()
    }

    const matchHappened = async () => {
        playMatchSound()
        //alert("You have a match!");
        setIsMatchNotificationVisible(true)
        setIsButtonDisabled(true)
        setMatchBonus(0);
        setPenalty(penalty + 3);


        const username = loggedInUser.username;
        const charactersId = frontRandomCharacter.id;
        const charactersName = frontRandomCharacter.name;
        const characterImg = frontRandomCharacter.pictures[0] === undefined ? '/assets/images/default_profiles/default.jpg' : frontRandomCharacter.pictures[0].url;
        const data = { username, charactersName, charactersId, characterImg };
        try {
            const response = await fetch("/api/matches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            setMatched(true);

            setTimeout(() => {
                setMatched(false)
            }, 1600);



            console.log(await response.json());
        } catch (e) {
            console.error(e);
        }
    };

    // Handle Notification Close
    function handleNotificationClose() {
        setIsMatchNotificationVisible(false)
        setIsButtonDisabled(false)
    }


    return (

        <div className="main">

            {isMatchNotificationVisible && <MatchNotification onClose={handleNotificationClose} />}

            {!frontRandomCharacter ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="imageContainer" key={frontRandomCharacter.id}>
                        <img
                            src={frontRandomCharacter.pictures[0] === undefined ? '/assets/images/default_profiles/default.jpg' : frontRandomCharacter.pictures[0].url}
                            alt={frontRandomCharacter.name}
                        />
                    </div>
                    <div className="characterDetails">
                        <div className="quickDetails">
                            <h3>{frontRandomCharacter.name}{frontRandomCharacter.race === "??" || frontRandomCharacter.race === null ? "" : `, ${frontRandomCharacter.race}`} </h3>
                            {frontRandomCharacter.age === "??" || frontRandomCharacter.age === null ? "" : <h3>{frontRandomCharacter.age} years old</h3>}

                        </div>

                        {frontRandomCharacter.job === "??" || frontRandomCharacter.job === null ? "" : <h5 className="job">{frontRandomCharacter.job}</h5>}

                        <div id="arrowDiv"
                            onMouseOver={() => setIsMoreDetailsVisible(true)}
                            onMouseOut={() => setIsMoreDetailsVisible(false)}
                        >

                            <ArrowIcon /></div>

                        {
                            isMoreDetailsVisible && (
                                <> <h5 className="moreDetails">More details:</h5>
                                    {frontRandomCharacter.gender !== "??" && frontRandomCharacter.gender !== null && (
                                        <h6 className="moreDetails">
                                            {frontRandomCharacter.gender === "Female" ? "Gender: Female ♀️" : "Gender: Male ♂️"}
                                        </h6>
                                    )}
                                    {frontRandomCharacter.height !== "??" && frontRandomCharacter.height !== null && (
                                        <h6 className="moreDetails">Height: {frontRandomCharacter.height} 🧍↕</h6>
                                    )}
                                    {frontRandomCharacter.weight !== "??" && frontRandomCharacter.weight !== null && (
                                        <h6 className="moreDetails">Weight: {frontRandomCharacter.weight} 🪶</h6>
                                    )}
                                </>
                            )
                        }



                    </div>


                    <div className="characterDesc">

                        {frontRandomCharacter.description === "??" || frontRandomCharacter.description === null ? "" : <p>{frontRandomCharacter.description}</p>}

                    </div>

                    {frontRandomCharacter.origin === "??" || frontRandomCharacter.origin === null ? "" : <p className="origin">Origin: {frontRandomCharacter.origin}</p>}

                    <div className="buttonWrapper">
                        <button className="dislikeButton" onClick={handleDislike} disabled={isButtonDisabled ? 'true' : '' || isGameOver ? 'true' : ''} >👎</button>
                        <button className="likeButton" onClick={handleLike} disabled={isButtonDisabled ? 'true' : '' || isGameOver ? 'true' : ''}>❤️</button>
                    </div>


                </>
            )}

        </div>
    )
};

export default Main;



/*
  {
    "id": "6c101c8e-1386-4592-1013-08d6afcab3e2",
    "name": "Garnet",
    "japaneseName": null,
    "age": "16",
    "gender": "Female",
    "race": "Summoner",
    "job": "Summoner",
    "height": "1.64",
    "weight": "??",
    "origin": "Final Fantasy IX",
    "description": "Garnet Til Alexandros XVII (ガーネット・ティル・アレクサンドロス17世 Gānetto tiru Arekusandorosu Jūnanasei), alias Dagger (ダガー, Dagā) and birth name Sarah (セーラ, Sēra), is the deuteragonist of Final Fantasy IX, and the heir of Alexandria in the 17th generation. Garnet notices a change in her mother, Queen Brahne, and seeks to escape Alexandria Castle. Hiding her identity while traveling with Zidane, Garnet takes the alias Dagger, inspired by Zidane's weapon. Initially polite and soft-spoken, Garnet matures during her travels, eventually resolving to use her powers as a summoner to protect her kingdom.",
    "pictures": [
      {
        "id": "134127c5-495c-4f3c-ba49-5dc925dcb5c1",
        "url": "https://mooglestorage.blob.core.windows.net/images/134127c5-495c-4f3c-ba49-5dc925dcb5c1.jpg",
        "primary": 1,
        "collectionId": "6c101c8e-1386-4592-1013-08d6afcab3e2"
      }
    ],
    "stats": []
  }
*/

