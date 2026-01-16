import { useNavigate } from "react-router-dom"

const SignIn = () => {
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()

        const user = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        try {
            const res = await fetch("https://fictional-funicular-q7j97gjg5jp29xxg-5173.app.github.dev/signin", {
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
                    <button className="tab-btn" onclick="showSignup()">
                        Регистрация
                    </button>
                </div>
                <form id="login-form" className="auth-form active">
                    <div className="form-group">
                        <label>Имя лудика</label>
                        <input type="text" placeholder="Введите имя" required="" />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            placeholder="Введите пароль"
                            required=""
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