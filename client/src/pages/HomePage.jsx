import { useEffect, useState } from "react";
import Main from "../components/Main";
import Messages from "../components/Messages";


function HomePage ({setIsLoggedin, loggedInUser}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const defaultPictureURL = "/assets/images/default_profiles/default.jpg";
    const [isLoading, setIsLoading] = useState(true);
    const [matched, setMatched] = useState(false);

    return (
        <>
        {isLoading && <div>Loading...</div>}
        <div className={`homepage ${isLoading ? 'hidden' : ''}`}>

        <Messages loggedInUser={loggedInUser} matched={matched}/>

        <Main loggedInUser={loggedInUser} setIsLoading={setIsLoading} setMatched={setMatched}/>

        <div className="profileContainer">
        <img src={loggedInUser.profilePicture || defaultPictureURL} alt="Profile" className="profileImg" onClick={() => setIsModalVisible(!isModalVisible)}/>
        {isModalVisible && <div className="profileImgModal">
            <a href="">Settings</a>
            <a href={null} onClick={() => setIsLoggedin(false)}>Logout</a>
            </div>}
        </div>
        </div>
        </>
    )


};

export default HomePage;