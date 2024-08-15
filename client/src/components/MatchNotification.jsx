import React from "react"

const MatchNotification = ({ onClose }) => {
    return (
        <div className="match-notification">
            <div className="notification-content">
                <h2>You have a match!</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

export default MatchNotification

