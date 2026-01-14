import { create } from "zustand"
import { User } from "@/types/auth"

interface AuthState {
    token: string | null
    user: User | null
    setToken: (token: string) => void
    setUser: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    user: null,
    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),
    logout: () => set({ token: null, user: null }),
}))
