import React, {useState, useEffect} from 'react';

const Messages = (props) => {
    const {loggedInUser, matched} = props;
    
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`/api/matches/${loggedInUser.username}`)
                const data = await response.json();
                setMatches(data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchMatches()
    }, [matched])

    return (
        <div className="matchedWith">
            {matches.map(match => (
                <div className='match' key={match.matchedAt}>
                    <h3>{match.charactersName}</h3>
                    {/*Picture of the character and additional info could come here.*/}
                </div>
            ))}
        </div>
    )
}

export default Messages;