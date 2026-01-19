import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import Input from "../components/Input"
import Button from "../components/Button"

const SignUp = () => {
    const navigate = useNavigate()
    const [error, setError] = useState()
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(undefined)
        
        if (e.target.password.value !== e.target.password2.value){
            setError("Пароли не совпадают")
            return
        }
        
        const user = {
            email: e.target.email.value,
            username: e.target.username.value,
            password: e.target.password.value,
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

            const data = await res.json()

            if (!res.ok) throw new Error(data)

            console.log(res)
            navigate("/")
        } catch (error) {
            console.error(error)
            setError("Ошибка регистрации. Проверь данные или попробуй другое имя")
        }
    }
    return (
        <div id="auth-screen" className="screen active">
            <div className="auth-container">
                <h1 className="casino-title">🎰Kazik🎰</h1>
                <div className="auth-tabs">
                    <Link to={"/login"} className="tab-btn">
                        Вход
                    </Link>
                    <Link to={"/signup"} className="tab-btn active">
                        Регистрация
                    </Link>
                </div>
                <form onSubmit={handleSubmit} id="signup-form" className="auth-form">
                    <div className="form-group">
                        <label>Имя лудика</label>
                        <Input
                            type="text"
                            placeholder="Придумайте имя"
                            name="username"
                            required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <Input
                            type="email"
                            placeholder="Введите email"
                            name="email"
                            required />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <Input
                            type="password"
                            placeholder="Придумайте пароль"
                            name="password"
                            required />
                    </div>
                    <div className="form-group">
                        <label>Подтвердите пароль</label>
                        <Input
                            type="password"
                            placeholder="Повторите пароль"
                            name="password2"
                            required />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <Button type="submit" className="btn btn-primary">
                        Создать аккаунт
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SignUp