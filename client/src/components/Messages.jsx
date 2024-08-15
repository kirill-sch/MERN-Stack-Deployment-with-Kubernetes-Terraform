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
        <div className="matchesContainer">
            <h3 style={{alignSelf:"center"}}>Matches</h3>
            {matches.map(match => (

                <div className='match' key={match.matchedAt}>
                    <div className="topHalf">
                    <img src={match.characterImg} alt={match.charactersName} />
                    <h3>{match.charactersName}</h3>
                    </div>
                    <div className="bottomHalf">
                    <p style={{fontSize:"0.7em"}}>{match.matchedAt.slice(0, 10)}</p>
                    </div>
                </div>

            ))}
        </div>
    )
}

export default Messages;