import {useNavigate} from "react-router-dom"
import SignIn from './SignIn'

const SignUp = () => {
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (e.target.password.value !== e.target.confirmPassword.value) {
            alert("Пароли не совпадают! Пожалуйста, проверьте введенные пароли.")
            return
        }

        const user = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        try {
            const res = await fetch("https://bug-free-lamp-r4p96rq75w46fpq56-3000.app.github.dev/auth/signup", {
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
                <button className="tab-btn" onClick={() => navigate("/SignIn")}>
                    Вход
                </button>
                <button className="tab-btn active" onClick="showSignup()">
                    Регистрация
                </button>
            </div>
            <form id="signup-form" className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя пользователя</label>
                    <input
                        name ="username"
                        type="text"
                        placeholder="Придумайте имя"
                        required=""
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Введите email"
                        required=""
                    />
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Придумайте пароль"
                        required=""
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <label>Подтвердите пароль</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Повторите пароль"
                        required=""
                        minLength="6"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Создать аккаунт
                </button>
            </form>
        </div>
    </div>
            
    )
}

export default SignUp