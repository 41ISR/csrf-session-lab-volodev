import { create } from "zustand"

const useAuthStore = create((set) => ({
    user: undefined,
    checkAuth: async () => {
        try {
            const res = await fetch("https://bug-free-lamp-r4p96rq75w46fpq56-3000.app.github.dev/auth/check", {
                credentials: "include"
            })
            console.log(res)

            if (!res.ok) throw new Error(res.error)

            const data = await res.json()

            if (!data) return

            set((state) => ({ ...state, user: data }))
        } catch (error) {
            console.error(error)
        }
    },
    clearUser: () => {
        set((state) => ({...state, user: undefined}))
    }
}))

export default useAuthStore