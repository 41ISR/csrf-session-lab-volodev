import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

const Logout = () => {
    const { clearUser } = useAuthStore()
    const navigate = useNavigate()
    useEffect(() => {
        const logUserOut = async () => {
            await fetch("https://effective-tribble-v6q4r975rv6vf6gvv-5173.app.github.dev//auth/logout", {
                credentials: "include"
            })
            clearUser()
            navigate("/signin")
        }
        logUserOut()
    }, [])

    return <></>
}

export default Logout