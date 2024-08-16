import { useEffect, useState } from "react";
import Main from "../components/Main";
import Messages from "../components/Messages";


function HomePage ({setLoggedInUserId, setLoggedInUser, loggedInUser, playMatchSound}) {
    const defaultPictureURL = "/assets/images/default_profiles/default.jpg";
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [matched, setMatched] = useState(false);



        async function updateUserPrefs (userUpdates) {

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

    };

  

    return (
        <>
        {isLoading && <h1>Loading...</h1>}
        <div className={`homepage ${isLoading ? 'hidden' : ''}`}>

        <Messages loggedInUser={loggedInUser} matched={matched}/>

        <Main loggedInUser={loggedInUser} setIsLoading={setIsLoading} setMatched={setMatched} setLoggedInUser={setLoggedInUser} updateUserPrefs={updateUserPrefs} playMatchSound={playMatchSound}/>

        <div className="profileContainer">
        <img src={loggedInUser.profilePicture || defaultPictureURL} alt="Profile" className="profileImg" onClick={() => setIsModalVisible(!isModalVisible)}/>
        {isModalVisible && <div className="profileImgModal">
            <a style={{marginBottom:"10px"}}>{loggedInUser.username}</a>
            <a>Settings</a>
            <a onClick={() => { setLoggedInUserId(null) }}>Logout</a>
            </div>}
        </div>
        </div>
        </>
    )


};

export default HomePage;