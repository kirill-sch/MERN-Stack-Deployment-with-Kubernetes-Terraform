// Imports //

import React, { useState, useEffect } from "react"
import ArrowIcon from "./ArrowIcon"

// Global Variables //

const CHARACTERS_API = "https://www.moogleapi.com/api/v1/characters/"

// Function //

function Main({loggedInUser, setIsLoading, setMatched}) {

    const [characters, setCharacters] = useState([])
    const [randomCharacter, setRandomCharacter] = useState(null)
    const [isMoreDetailsVisible, setIsMoreDetailsVisible] = useState(false);
    const [matchBonus, setMatchBonus] = useState(0)
    const [penalty, setPenalty] = useState(0);

    useEffect(() => {

        async function fetchCharacters() {
            try {
                const response = await fetch(CHARACTERS_API)

                if (!response.ok) {
                    throw new Error("Response is not ok in the body of the fetchCharacters()!")
                }

                const fetchedCharacters = await response.json()
                console.log(fetchedCharacters)
                setCharacters(fetchedCharacters)
                console.log("Characters fetched successfully!")

            } catch (error) {
                console.error("fetchCharacters() fetch error", error)
            }
        }

        fetchCharacters()

    }, [])


    useEffect(() => {

        function getRandomIndex() {

            if (characters.length > 0) {
                const randomIndex = Math.floor(Math.random() * characters.length)
                const randomGeneratedCharacter = characters[randomIndex]
                console.log(randomGeneratedCharacter)
                setRandomCharacter(randomGeneratedCharacter)
                
                setTimeout(() => {
                    setIsLoading(false)
                }, 1600);
            }
        }

        getRandomIndex()

    }, [characters])

    const handleLike = async () => {
        const likedCharacterId = randomCharacter.id;
        const likedBy = loggedInUser.username;
        const data = { likedBy, likedCharacterId }; 
        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }) 

            //setRandomCharacter(null);
            const matchProbability = (Math.floor(Math.random() * (35 - 15 + 1)) + 15) / 100;
            const isMatch = Math.random() < ((loggedInUser.baseStat - penalty) + matchBonus) / 100;
            // penalty needed
            isMatch ? matchHappened() : setMatchBonus(matchBonus + 5);

        } catch (e) {
            console.error(e);
        }
    }

    const handleDislike = async () => {
        const dislikedCharacterId = randomCharacter.id;
        const dislikedBy = loggedInUser.username;
        const data = { dislikedBy, dislikedCharacterId } 
        try {
            const response = await fetch('/api/dislikes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }) 

            //setRandomCharacter(null);
        } catch (e) {
            console.error(e);
        }
    }

    const matchHappened = async () => {
      alert("You have a match!");
      setMatchBonus(0);
      setPenalty(penalty + 3);
      

      const username = loggedInUser.username;
      const charactersId = randomCharacter.id;
      const charactersName = randomCharacter.name;
      const data = { username, charactersName, charactersId };
      try {
        const response = await fetch("/api/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        setMatched(true);
        console.log(await response.json());
      } catch (e) {
        console.error(e);
      }
    }; 
        
    
    



    return (

        <div className="main">

            {!randomCharacter ? (
                <p></p>
            ) : (
                <>
                    <div className="imageContainer" key={randomCharacter.id}>
                        <img
                            src={randomCharacter.pictures[0] === undefined ? '/assets/images/default_profiles/default.jpg' : randomCharacter.pictures[0].url}
                            alt={randomCharacter.name}
                        />
                    </div>
                    <div className="characterDetails">
                        <div className="quickDetails">
                            <h3>{randomCharacter.name}{randomCharacter.race === "??" || randomCharacter.race === null ? "" : `, ${randomCharacter.race}`} </h3>
                            {randomCharacter.age === "??" || randomCharacter.age === null ? "" : <h3>{randomCharacter.age} years old</h3>}

                        </div>

                        {randomCharacter.job === "??" || randomCharacter.job === null ? "" : <h5 className="job">{randomCharacter.job}</h5>}

                        <div id="arrowDiv"
                            onMouseOver={() => setIsMoreDetailsVisible(true)}
                            onMouseOut={() => setIsMoreDetailsVisible(false)}
                        >

                            <ArrowIcon /></div>

                        {
                            isMoreDetailsVisible && (
                                <> <h5 className="moreDetails">More details:</h5>
                                    {randomCharacter.gender !== "??" && randomCharacter.gender !== null && (
                                        <h6 className="moreDetails">
                                            {randomCharacter.gender === "Female" ? "Gender: Female ♀️" : "Gender: Male ♂️"}
                                        </h6>
                                    )}
                                    {randomCharacter.height !== "??" && randomCharacter.height !== null && (
                                        <h6 className="moreDetails">Height: {randomCharacter.height} 🧍↕</h6>
                                    )}
                                    {randomCharacter.weight !== "??" && randomCharacter.weight !== null && (
                                        <h6 className="moreDetails">Weight: {randomCharacter.weight} 🪶</h6>
                                    )}
                                </>
                            )
                        }



                    </div>


                    <div className="characterDesc">

                        {randomCharacter.description === "??" || randomCharacter.description === null ? "" : <p>{randomCharacter.description}</p>}

                    </div>

                    {randomCharacter.origin === "??" || randomCharacter.origin === null ? "" : <p className="origin">Origin: {randomCharacter.origin}</p>}

                    <div className="buttonWrapper">
                        <button className="dislikeButton" onClick={handleDislike}>👎</button>
                        <button className="likeButton" onClick={handleLike}>❤️</button>
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

