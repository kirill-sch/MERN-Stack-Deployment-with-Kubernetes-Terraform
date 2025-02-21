// Imports //

import React, { useState, useEffect } from "react"
import data from './../../../server/db.json'      //Make an endpoint for this.

// Function //

function Preferences({ setUserPreferences , playClickSound}) {

    const [allRaces, setAllRaces] = useState([])
    const [selectedGenders, setSelectedGenders] = useState(["Male", "Female"])
    const [selectedRaces, setSelectedRaces] = useState([])

    useEffect(() => {

        function createAllRaces() {

            let races = []
            for (let i = 0; i < data.length; i++) {
                if (!races.includes(data[i].race)) {
                    races.push(data[i].race)
                }
            }
            races = races.filter(race => race !== "??")
            console.log(races)
            setAllRaces(races)
            setSelectedRaces(races)

        }

        createAllRaces()

    }, [])

    useEffect(() => {

        if (selectedGenders && selectedRaces) {
            const userPref = {
                gender: selectedGenders,
                races: selectedRaces
            }

            setUserPreferences(userPref)
        }
    }, [selectedGenders, selectedRaces])

    // Handle genderchanges
    function handleGenderChange(event) {
        playClickSound();
        setSelectedGenders(prevSelectedGenres => {
            const isAlreadySelected = prevSelectedGenres.includes(event.target.value)

            if (isAlreadySelected) {
                if (prevSelectedGenres.length === 1) {
                    return prevSelectedGenres
                } else {
                    return prevSelectedGenres.filter(gender => gender !== event.target.value)
                }
            } else {
                return [...prevSelectedGenres, event.target.value]
            }
        })
    }

    // Handle racechanges
    function handleRaceChange(event) {
        playClickSound();
        setSelectedRaces(prevSelectedRaces => {
            const isAlreadySelected = prevSelectedRaces.includes(event.target.value)

            if (isAlreadySelected) {
                if (prevSelectedRaces.length === 1) {
                    return prevSelectedRaces
                } else {
                    return prevSelectedRaces.filter(race => race !== event.target.value)
                }
            } else {
                return [...prevSelectedRaces, event.target.value]
            }
        })
    }

    return (
        <div className="preferencesDiv">

            <div className="gendersDiv">
                <h4 style={{ marginTop: '10px', alignSelf: "center" }}>Genders</h4>
                <label>
                    <input
                        type="checkbox"
                        value="Male"
                        checked={selectedGenders.includes("Male")}
                        onChange={handleGenderChange}
                    />
                    Male
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Female"
                        checked={selectedGenders.includes("Female")}
                        onChange={handleGenderChange}
                    />
                    Female
                </label>
            </div>

            <div className="racesDiv">
                <h4 style={{ marginTop: '10px', alignSelf: "center" }}>Races</h4>
                {allRaces.map(race => (
                    <label key={race}>
                        <input
                            type="checkbox"
                            value={race}
                            checked={selectedRaces.includes(race)}
                            onChange={handleRaceChange}
                        />
                        {race}
                    </label>
                ))}
            </div>

        </div>
    )
}


export default Preferences;

