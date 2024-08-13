// Imports //

import React, { useState, useEffect } from "react"

// Global Variables //

const CHARACTERS_API = "https://www.moogleapi.com/api/v1/characters/"

// Function //

function Main() {

    const [characters, setCharacters] = useState([])
    const [randomCharacter, setRandomCharacter] = useState(null)

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
            }
        }

        getRandomIndex()

    }, [characters])



    return (

        <div className="main">

            {!randomCharacter ? (
                <p></p>
            ) : (
                <div className="character" key={randomCharacter.id}>
                    <img
                        src={randomCharacter.pictures[0].url}
                        alt={randomCharacter.name}
                    />
                    <h1>Name: {randomCharacter.name}</h1>
                    {randomCharacter.age === "??" || randomCharacter.age === null ? "" : <h1>Age: {randomCharacter.age}</h1>}
                    {randomCharacter.gender === "??" || randomCharacter.gender === null ? "" : <h1>Gender: {randomCharacter.gender}</h1>}
                    {randomCharacter.race === "??" || randomCharacter.race === null ? "" : <h1>Race: {randomCharacter.race}</h1>}
                    {randomCharacter.job === "??" || randomCharacter.job === null ? "" : <h1>Job: {randomCharacter.job}</h1>}
                    {randomCharacter.height === "??" || randomCharacter.height === null ? "" : <h1>Height: {randomCharacter.height}</h1>}
                    {randomCharacter.weight === "??" || randomCharacter.weight === null ? "" : <h1>Weight: {randomCharacter.weight}</h1>}
                    {randomCharacter.origin === "??" || randomCharacter.origin === null ? "" : <h1>Origin: {randomCharacter.origin}</h1>}
                    {randomCharacter.description === "??" || randomCharacter.description === null ? "" : <h1>About me: {randomCharacter.description}</h1>}
                </div>
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

