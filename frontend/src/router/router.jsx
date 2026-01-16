import { createBrowserRouter } from "react-router-dom"
import Index from "../pages/Index"
import Signup from "../pages/SignUp";
import Signin from "../pages/SignIn"
import Logout from "../pages/Logout"
import AuthProvider from "../components/AuthProvider"
import Leaderboard from "../pages/Leaderboard";


export const router = createBrowserRouter ([
    {
        path: "/",
        element: <AuthProvider />,
        children: [{
            index: true,
            element: <Index />
        },

        {
            path: "/leaderboard",
            element: <Leaderboard />,
        }
    ]
    },
    {
        path: "/logout",
        element: <Logout />
    }, 

    {
        path: "/Signup",
        element: <Signup />
    },

    {
        path: "/signin",
        element: <Signin />
    },
])