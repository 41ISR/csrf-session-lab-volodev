import {useNavigate} from "react-router-dom"

const SignUp = () => {
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const user = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        try {
            const res = await fetch("https://fictional-funicular-q7j97gjg5jp29xxg-5173.app.github.dev/auth/signup", {
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
            <h1 className="casino-title">🎲 [ПРИДУМАЙТЕ НАЗВАНИЕ]</h1>
            <div className="auth-tabs">
                <button className="tab-btn active" onclick="showLogin()">
                    Вход
                </button>
                <button className="tab-btn" onclick="showSignup()">
                    Регистрация
                </button>
            </div>
            <form id="signup-form" className="auth-form">
                <div className="form-group">
                    <label>Имя пользователя</label>
                    <input
                        type="text"
                        placeholder="Придумайте имя"
                        required=""
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Введите email"
                        required=""
                    />
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input
                        type="password"
                        placeholder="Придумайте пароль"
                        required=""
                    />
                </div>
                <div className="form-group">
                    <label>Подтвердите пароль</label>
                    <input
                        type="password"
                        placeholder="Повторите пароль"
                        required=""
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