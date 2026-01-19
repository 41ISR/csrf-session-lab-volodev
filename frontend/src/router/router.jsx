import { createBrowserRouter } from "react-router-dom"
import Game from "../pages/Game"
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"
import Logout from "../pages/Logout"
import AuthProvider from "../components/AuthProvider"
import LeaderBoard from "../pages/LeaderBoard"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthProvider />,
        children: [{
            index: true,
            element: <Game />
        }]
    },
        {
        path: "/logout",
        element: <Logout />
    }, 
    {
        path: "/login",
        element: <Login />
    }, 
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/leaderboard",
        element: <LeaderBoard />
    },
])