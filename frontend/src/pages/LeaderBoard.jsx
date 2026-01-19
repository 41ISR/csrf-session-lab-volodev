
import { useNavigate } from "react-router-dom"
import useAppStore from "../store/useAppStore"
import { useAuthStore } from "../store/useAuthStore"
import Player from "../components/Player"
import Button from "../components/Button"
import { useEffect } from "react"

const LeaderBoard = () => {
    const navigate = useNavigate()
    const { leaderboard, setLeaderBoard } = useAppStore()
    const { user } = useAuthStore()

    useEffect(() => {
        fetch("https://bug-free-lamp-r4p96rq75w46fpq56-3000.app.github.dev/api/leaderboard")
            .then(r => r.json())
            .then(setLeaderBoard)
    }, [])

    return (
        <div id="leaderboard-screen" className="screen">
            <div className="leaderboard-container">
                <Button className="back-btn" onClick={() => navigate("/")}>← Назад к игре</Button>
                <h1>🏆 Рейтинг лучших лудоманов 🏆</h1>

                <div className="leaderboard-table">
                    <div className="leaderboard-header">
                        <span>Место</span>
                        <span>Лудик</span>
                        <span>Баллы</span>
                    </div>

                    {leaderboard.map((u, i) => (
                        <Player
                            key={u.id}
                            place={i + 1}
                            username={u.username}
                            escore={u.escore}
                            isMe={u.id === user?.user?.userId}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeaderBoard
 