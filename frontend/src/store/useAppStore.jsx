import { create } from "zustand";

const useAppStore = create((set) =>({
    currentEscore: 0,
    setCurrentEscore: (amount) => set((state) => ({...state, currentEscore: amount})),
    leaderboard: [],
    setLeaderBoard: (board) => set((state)=>({...state, leaderboard: board}))
}))

export default useAppStore