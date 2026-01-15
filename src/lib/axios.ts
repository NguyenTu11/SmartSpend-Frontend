import axios from "axios"
import { ENV } from "./env"

export const api = axios.create({
    baseURL: ENV.API_URL,
    withCredentials: true,
    timeout: 60000,
})

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/auth/login"
        }
        return Promise.reject(error)
    }
)
