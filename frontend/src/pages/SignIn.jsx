import { useNavigate } from "react-router-dom"
import SignUp from './SignUp'

const SignIn = () => {
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const user = {
            username: e.target.username.value,
            password: e.target.password.value
        }

        try {
            const res = await fetch("https://bug-free-lamp-r4p96rq75w46fpq56-3000.app.github.dev/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
                credentials: "include"
            })

            if (!res.ok) throw new Error(res.statusText)

            console.log(res)
            navigate("/")

        } catch (error) {
            console.error(error)
        }
    }

    return (
            <div id="auth-screen" className="screen active">
                <div className="auth-container">
                <h1 className="casino-title">🎰Kazik🎰</h1>
                <div className="auth-tabs">
                    <button className="tab-btn active" onclick="showLogin()">
                        Вход
                    </button>
                    
                    <button className="tab-btn" onClick={() => navigate("/SignUp")}>
                        Регистрация
                    </button>
                </div>
                <form id="login-form" className="auth-form active" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя лудика</label>
                        <input name="username" type="text" placeholder="Введите имя" required="" />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Введите пароль"
                            required=""
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignIn