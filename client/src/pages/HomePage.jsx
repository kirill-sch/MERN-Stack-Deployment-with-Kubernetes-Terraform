import { useState } from "react";
import Main from "../components/Main";


function HomePage ({setIsLoggedin, loggedInUser}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const defaultPictureURL = "/assets/images/default_profiles/default.jpg";

    return (
        <div className="homepage">
        <div className="messagesContainer">Messages</div>
        <Main loggedInUser={loggedInUser}/>

        <div className="profileContainer">
        <img src={loggedInUser.profilePicture || defaultPictureURL} alt="Profile" className="profileImg" onClick={() => setIsModalVisible(!isModalVisible)}/>
        {isModalVisible && <div className="profileImgModal">
            <a href="">Settings</a>
            <a href={null} onClick={() => setIsLoggedin(false)}>Logout</a>
            </div>}
        </div>
        </div>
    )


};

export default HomePage;