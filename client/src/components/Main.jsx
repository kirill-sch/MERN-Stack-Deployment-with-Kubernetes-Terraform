// Imports //

import React, { useState, useEffect } from "react"
import ArrowIcon from "./ArrowIcon"

// Global Variables //

//const CHARACTERS_API = "https://www.moogleapi.com/api/v1/characters/"

// Function //

function Main({ loggedInUser, setIsLoading, setMatched, setUserUpdates }) {

    const [characters, setCharacters] = useState([])
    const [backRandomCharacter, setBackRandomCharacter] = useState(null);
    const [frontRandomCharacter, setFrontRandomCharacter] = useState(null)
    const [isMoreDetailsVisible, setIsMoreDetailsVisible] = useState(false);
    const [matchBonus, setMatchBonus] = useState(0)
    const [penalty, setPenalty] = useState(0);
    const [gameOver, setGameOver] = useState(false);

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

                    //Don't try to fill backRandomCharacter, when there is only one character left.
                    //Also, make GAME OVER card when there aren't any characters left.

                    const gameOver = {
                        _id: "",
                        age: "",
                        description: "No more characters :(",
                        gender: "",
                        height: "",
                        id: "",
                        japaneseName: "",
                        job: "",
                        name: "Game Over",
                        origin: "",
                        pictures: [{ url: "/assets/images/gameover.png" }],
                        race: "",
                        stats: [],
                        weight: ""

                    }

                    if (fetchedCharacters.length < 1) {

                        setFrontRandomCharacter(gameOver)
                        setGameOver(true)
                        return
                    };

                    setFrontRandomCharacter(fetchedCharacters[0])
                    setBackRandomCharacter(gameOver)
                    return
                }

                console.log("fetchedCharacters: ", fetchedCharacters)

                const lastFrontCardOnline = loggedInUser.lastFrontCard;
                console.log("Lastfrontcardonline", lastFrontCardOnline);

                const lastFrontCardLocal = JSON.parse(localStorage.getItem('lastFrontCard'));

                if (lastFrontCardOnline._id) {
                    //Save to local storage only
                    setFrontRandomCharacter(lastFrontCardOnline)
                    localStorage.setItem("lastFrontCard", JSON.stringify(lastFrontCardOnline));
                }

                else if (lastFrontCardOnline.null && lastFrontCardLocal) {
                    //Save to DB only
                    setFrontRandomCharacter(lastFrontCardLocal);
                    setUserUpdates({ ...loggedInUser, lastFrontCard: lastFrontCardLocal })

                }

                else {
                    //Save to DB and local storage
                    setUserUpdates({ ...loggedInUser, lastFrontCard: fetchedCharacters[0] });
                    localStorage.setItem("lastFrontCard", JSON.stringify(fetchedCharacters[0]));

                    setFrontRandomCharacter(fetchedCharacters[0])
                    //Save last card to local storage.
                    localStorage.setItem("lastFrontCard", JSON.stringify(fetchedCharacters[0]));
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


        setFrontRandomCharacter(backRandomCharacter);

        //Save to DB and local storage
        setUserUpdates({ ...loggedInUser, lastFrontCard: backRandomCharacter });
        localStorage.setItem("lastFrontCard", JSON.stringify(backRandomCharacter));

        if (characters.length < 1) {
            setBackRandomCharacter(null)
            setCharacters(null);
        }

        else {

            setBackRandomCharacter(characters[0]);
            setCharacters(characters.slice(1));

            try {
                const response = await fetch('/api/characters/1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loggedInUser)
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch new character.')
                }
                const newCharacter = await response.json();

                setCharacters(prevCharacters => [...prevCharacters, ...newCharacter])
            } catch (e) {
                console.error('Error with fetch() in putCharactersInStates.');
            }
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

            //setFrontRandomCharacter(null);
            const matchProbability = (Math.floor(Math.random() * (35 - 15 + 1)) + 15) / 100;
            const isMatch = Math.random() < ((loggedInUser.baseStat - penalty) + matchBonus) / 100;
            // penalty needed
            isMatch ? matchHappened() : setMatchBonus(matchBonus + 5);
            putCharactersInStates();

        } catch (e) {
            console.error(e);
        }
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
    }

    const matchHappened = async () => {
        alert("You have a match!");
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






    return (

        <div className="main">

            {!frontRandomCharacter ? (
                <p></p>
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
                        <button className="dislikeButton" onClick={handleDislike} disabled={gameOver ? 'true' : ''}>👎</button>
                        <button className="likeButton" onClick={handleLike} disabled={gameOver ? 'true' : ''}>❤️</button>
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

