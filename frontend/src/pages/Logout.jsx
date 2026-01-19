import { useEffect } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const { clearUser } = useAuthStore()
    const navigate = useNavigate()
    useEffect(() => {
        const logUserOut = async () => {
            await fetch("https://bug-free-lamp-r4p96rq75w46fpq56-3000.app.github.dev/auth/logout", {
                method: "POST",
                credentials: "include"
            })
            clearUser()
            navigate("/login")
        }
        logUserOut()
    }, [])

    return <></>
}

export default Logout