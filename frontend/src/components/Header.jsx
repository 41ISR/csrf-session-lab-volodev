import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import Button from "./Button"

const Header = ({ balance }) => {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    return (
        <header className="game-header">
            <div className="user-info">
                <span className="username">{user.user.username}</span>
                <span className="balance">💸 {balance}Баллов</span>
            </div>
            <nav className="game-nav">
                <Button className="nav-btn" onClick={() => navigate("/leaderboard")}>
                    🏆 Рейтинг
                </Button>
                <Button className="nav-btn" onClick={() => navigate("/logout")}>
                    Выход
                </Button>
            </nav>
        </header>
    )
}

export default Header