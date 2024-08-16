// Imports //

import React, { useState, useEffect, useRef } from "react"
import ArrowIcon from "./ArrowIcon"
import MatchNotification from "./MatchNotification"

// Global Variables //

//const CHARACTERS_API = "https://www.moogleapi.com/api/v1/characters/"

// Function //

function Main({ loggedInUser, setIsLoading, setMatched, playMatchSound, updateUserPrefs }) {

    const [characters, setCharacters] = useState([])
    const [backRandomCharacter, setBackRandomCharacter] = useState(null);
    const [frontRandomCharacter, setFrontRandomCharacter] = useState(null)
    const [isMoreDetailsVisible, setIsMoreDetailsVisible] = useState(false);
    const [noMatchBonus, setNoMatchBonus] = useState(0)
    const [matchPenalty, setMatchPenalty] = useState(0);
    const [isMatchNotificationVisible, setIsMatchNotificationVisible] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)


    const [isGameOver, setIsGameOver] = useState(false);

    const gameOverObj = {
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
            if (loggedInUser) {
                try {
                    const response = await fetch('/api/characters/4', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(loggedInUser)
                    })

                    const fetchedCharacters = await response.json();

                    if (!response.ok) {
                        throw new Error("Response is not ok in the body of the fetchCharacters()!")
                    }


                    const lastFrontCardOnline = loggedInUser.lastFrontCard;

                    if (fetchedCharacters.length > 3) {

                        if (loggedInUser.isFirstLoad) {
                            setFrontRandomCharacter(fetchedCharacters[0]);
                            setBackRandomCharacter(fetchedCharacters[1]);
                            setCharacters(fetchedCharacters.slice(2));

                            updateUserPrefs({
                                ...loggedInUser,
                                lastFrontCard: fetchedCharacters[0],
                                isFirstLoad: false
                            });
                        }

                        else {
                            setFrontRandomCharacter(lastFrontCardOnline);
                            setBackRandomCharacter(fetchedCharacters[0]);
                            setCharacters(fetchedCharacters.slice(2));
                        }



                    }

                    if (fetchedCharacters.length === 3) {

                        setFrontRandomCharacter(lastFrontCardOnline);
                        setBackRandomCharacter(fetchedCharacters[0]);
                        setCharacters(fetchedCharacters.slice(1))


                    }

                    if (fetchedCharacters.length === 2) {
                        setFrontRandomCharacter(lastFrontCardOnline);
                        setBackRandomCharacter(fetchedCharacters[0]);
                        setCharacters(fetchedCharacters.slice(1))

                        setCharacters(prevCharacters => [...prevCharacters, gameOverObj]);

                    }

                    if (fetchedCharacters.length === 1) {
                        setFrontRandomCharacter(lastFrontCardOnline);
                        setBackRandomCharacter(fetchedCharacters[0]);
                        setCharacters(fetchedCharacters.slice(1))
                        setCharacters(gameOverObj);

                    }

                    if (fetchedCharacters.length === 0) {

                        if (lastFrontCardOnline.name === "Game Over") {
                            setFrontRandomCharacter(lastFrontCardOnline);
                            setIsGameOver(true);
                            setBackRandomCharacter(null);
                            setCharacters(null);

                        }

                        else {


                            setFrontRandomCharacter(lastFrontCardOnline);
                            setBackRandomCharacter(gameOverObj)
                            setCharacters(null);

                        }


                    }

                    console.log("fetchedCharacters: ", fetchedCharacters)


                    console.log("LoggedInUser's stats: ", loggedInUser.userStats);

                    //Set modifiers
                    setMatchPenalty(loggedInUser.userStats.matchPenalty);
                    setNoMatchBonus(loggedInUser.userStats.noMatchBonus);

                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1600);

                    console.log("Characters fetched successfully!")

                } catch (error) {
                    console.error("fetchCharacters() fetch error", error)
                }
            }


        }

        fetchCharacters()

    }, [])

    const putCharactersInStates = async () => {

        setFrontRandomCharacter(backRandomCharacter);
        setBackRandomCharacter(characters[0]);
        setCharacters(characters.slice(1));

        if (backRandomCharacter.name === "Game Over") {

            setFrontRandomCharacter(backRandomCharacter);


            //Save to DB 
            setMatchPenalty(prevMatchPenalty => {
                setNoMatchBonus(prevNoMatchBonus => {
                    // Save the user prefs to DB with the latest values
                    const updatedLoggedInUser = {
                        ...loggedInUser,
                        userStats: {
                            ...loggedInUser.userStats,
                            matchPenalty: prevMatchPenalty, // Use the current matchPenalty
                            noMatchBonus: prevNoMatchBonus, // Use the current noMatchBonus
                        },
                        lastFrontCard: backRandomCharacter,
                    };

                    updateUserPrefs(updatedLoggedInUser);

                    return prevNoMatchBonus; // Continue using the latest noMatchBonus
                });

                return prevMatchPenalty; // Continue using the latest matchPenalty
            });


            setBackRandomCharacter(null);
            setCharacters(null);

            setIsGameOver(true);

        }

        console.log("front character:", frontRandomCharacter);
        console.log("back character: ", backRandomCharacter);
        console.log("characters:", characters);

        setMatchPenalty(prevMatchPenalty => {
            setNoMatchBonus(prevNoMatchBonus => {
                // Save the user prefs to DB with the latest values
                const updatedLoggedInUser = {
                    ...loggedInUser,
                    userStats: {
                        ...loggedInUser.userStats,
                        matchPenalty: prevMatchPenalty, // Use the current matchPenalty
                        noMatchBonus: prevNoMatchBonus, // Use the current noMatchBonus
                    },
                    lastFrontCard: backRandomCharacter,
                };

                updateUserPrefs(updatedLoggedInUser);

                return prevNoMatchBonus; // Continue using the latest noMatchBonus
            });

            return prevMatchPenalty; // Continue using the latest matchPenalty
        });


        if (!characters[1] || characters[1].name === "Game Over" || !characters[1] || characters[0].name === "Game Over" || characters.length === 0) {

            return;
        }

        else {

            let newCharacter = null;
            let attempts = 0;


            while (attempts < 15) {
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

                    else {
                        console.log("Duplicate character found, retrying...");
                    }

                } catch (error) {
                    console.error('Error fetching character:', error);
                    return; // Exit if an error occurs to prevent an infinite loop
                }

                if (attempts >= 15) {
                    console.log("No unique characters found after max attempts.");
                    newCharacter = gameOverObj;
                    break;
                }

            };

            // Add the new, unique character to the state
            setCharacters(prevCharacters => [...prevCharacters, newCharacter]);

        }

    };


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


            const stats = ((loggedInUser.userStats.baseStat - matchPenalty) + noMatchBonus);      //Add penalty to User Schema!

            const isMatch = Math.random() < stats / 100;
            console.log("Chance to match: ", stats, "%");
            console.log("Penalty:", matchPenalty);
            console.log("Bonus", noMatchBonus);

            if (isMatch) { matchHappened() }

            else {

                setNoMatchBonus(noMatchBonus + 5);

            }

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


        setNoMatchBonus(0);
        setMatchPenalty(matchPenalty + 3);


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
                                    {frontRandomCharacter.gender !== null && (
                                        <h6 className="moreDetails">
                                            {frontRandomCharacter.gender === "Female"
                                                ? "Gender: Female ♀️"
                                                : frontRandomCharacter.gender === "Male"
                                                    ? "Gender: Male ♂️"
                                                    : "Gender: ?? 👽"}
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
                    <p>Pen: {matchPenalty} Bon:{noMatchBonus}</p>

                    <div className="buttonWrapper">
                        <button className="dislikeButton" onClick={handleDislike} disabled={isButtonDisabled || isGameOver} >👎</button>
                        <button className="likeButton" onClick={handleLike} disabled={isButtonDisabled || isGameOver}>❤️</button>
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

