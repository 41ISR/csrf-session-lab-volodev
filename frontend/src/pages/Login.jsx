import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Input from "../components/Input"
import Button from "../components/Button"

const Login = () => {
    const navigate = useNavigate()
    const [error, setError] = useState()
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

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            

            navigate("/")

        } catch (error) {
            console.error(error)
            setError("Неверное имя лудика или пароль")
        }
    }

    return (
    <div id="auth-screen" className="screen active">
        <div className="auth-container">
            <h1 className="casino-title">🎰Kazik🎰</h1>
            <div className="auth-tabs">
                <Link to={"/login"} className="tab-btn active">
                    Вход
                </Link>
                <Link to={"/signup"} className="tab-btn">
                    Регистрация
                </Link>
            </div>
            <form id="login-form" className="auth-form active" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя лудика</label>
                    <Input type="text" placeholder="Введите имя" name="username" required="" />
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <Input
                        type="password"
                        placeholder="Введите пароль"
                        name="password"
                        required=""
                    />
                </div>
                {error && <p className="form-error">{error}</p>}
                <Button type="submit" className="btn btn-primary">
                    Войти
                </Button>
            </form>
        </div>
    </div>
    )
}

export default Login