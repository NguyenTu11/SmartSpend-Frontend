import { api } from "@/lib/axios"
import {
    LoginPayload,
    RegisterPayload,
    VerifyEmailPayload,
    AuthResponse,
    MessageResponse
} from "@/types/auth"
import { User, UpdateProfilePayload, FinancialScoreResponse } from "@/types/user"

export const authService = {
    login: (data: LoginPayload) =>
        api.post<AuthResponse>("/auth/login", data),

    register: (data: RegisterPayload) =>
        api.post<MessageResponse>("/auth/register", data),

    verifyEmail: (data: VerifyEmailPayload) =>
        api.post<MessageResponse>("/auth/verify-email", data),

    forgotPassword: (email: string) =>
        api.post<MessageResponse>("/auth/forgot-password", { email }),

    resetPassword: (email: string, code: string, newPassword: string) =>
        api.post<MessageResponse>("/auth/reset-password", { email, code, newPassword }),

    googleLogin: (credential: string) =>
        api.post<AuthResponse>("/auth/google", { credential }),

    getProfile: () =>
        api.get<User>("/user/profile"),

    updateProfile: (data: UpdateProfilePayload) =>
        api.put<User>("/user/profile", data),

    updateAvatar: (file: File) => {
        const formData = new FormData()
        formData.append("avatar", file)
        return api.post<{ message: string; avatar: { url: string; publicId: string } }>("/user/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
    },

    getFinancialScore: () =>
        api.get<FinancialScoreResponse>("/user/financial-score"),
}

