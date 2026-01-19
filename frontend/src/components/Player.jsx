const Player = ({ place, username, escore, isMe }) => (
    <div className={`leaderboard-row ${place === 1 ? "rank-1" : place === 2 ? "rank-2" : place === 3 ? "rank-3" : ""} ${isMe ? "highlight" : ""}`}>
        <span className="rank">{place <= 3 ? ["🥇","🥈","🥉"][place-1] : place}</span>
        <span className="player">{username}{isMe && " (Вы)"}</span>
        <span className="score">{escore}</span>
    </div>
)

export default Player