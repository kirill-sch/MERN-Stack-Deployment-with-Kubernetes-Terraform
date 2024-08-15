import { useEffect, useState } from "react";
import Main from "../components/Main";
import Messages from "../components/Messages";


function HomePage ({setLoggedInUser, setIsLoggedin, loggedInUser, playMatchSound}) {
    const defaultPictureURL = "/assets/images/default_profiles/default.jpg";
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [matched, setMatched] = useState(false);
    const [userUpdates, setUserUpdates] = useState({});


    useEffect(() => {

        async function updateUserPrefs () {

        try {
            const response = await fetch(`/api/user/${loggedInUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userUpdates)
            })

            if (!response.ok) {
                throw new Error('Failed to update user preferences.')
            }

            const updates = await response.json();
            delete updates.updatedUser.password;
            console.log("updates", updates);

        } catch (error) {

            console.log(error);
        }

    }

    updateUserPrefs();

    }, [userUpdates]);

    return (
        <>
        {isLoading && <h1>Loading...</h1>}
        <div className={`homepage ${isLoading ? 'hidden' : ''}`}>

        <Messages loggedInUser={loggedInUser} matched={matched}/>

        <Main loggedInUser={loggedInUser} setIsLoading={setIsLoading} setMatched={setMatched} setUserUpdates={setUserUpdates} setLoggedInUser={setLoggedInUser} playMatchSound={playMatchSound}/>

        <div className="profileContainer">
        <img src={loggedInUser.profilePicture || defaultPictureURL} alt="Profile" className="profileImg" onClick={() => setIsModalVisible(!isModalVisible)}/>
        {isModalVisible && <div className="profileImgModal">
            <a href="">Settings</a>
            <a onClick={() => { setLoggedInUser(null) }}>Logout</a>
            </div>}
        </div>
        </div>
        </>
    )


};

export default HomePage;