import { useState } from "react";
import Main from "../components/Main";


function HomePage ({profilePictureURL}) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <div className="homepage">
        <div className="messagesContainer">Messages</div>

        <Main/>

        <div className="profileContainer">
        <img src={profilePictureURL} alt="Profile" className="profileImg" onClick={() => setIsModalVisible(!isModalVisible)}/>
        {isModalVisible && <div className="profileImgModal">
            <a href="">Settings</a>
            <a href="">Logout</a>
            </div>}
        </div>
        </div>
    )


};

export default HomePage;