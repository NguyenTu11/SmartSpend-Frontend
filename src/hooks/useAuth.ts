import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService"
import { LoginPayload, RegisterPayload, VerifyEmailPayload } from "@/types/auth"
import { UpdateProfilePayload } from "@/types/user"
import { useAuthStore } from "@/store/authStore"

export const useLogin = () => {
    const router = useRouter()
    const { setToken, setUser } = useAuthStore()

    return useMutation({
        mutationFn: (data: LoginPayload) => authService.login(data),
        onSuccess: (res) => {
            const { token, user } = res.data
            localStorage.setItem("token", token)
            setToken(token)
            setUser(user)
            router.push("/dashboard")
        },
    })
}

export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: (data: RegisterPayload) => authService.register(data),
        onSuccess: (_, variables) => {
            sessionStorage.setItem("verifyEmail", variables.email)
            router.push("/auth/verify-email")
        },
    })
}

export const useVerifyEmail = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: (data: VerifyEmailPayload) => authService.verifyEmail(data),
        onSuccess: () => {
            sessionStorage.removeItem("verifyEmail")
            router.push("/auth/login")
        },
    })
}

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: () => authService.getProfile(),
        select: (res) => res.data,
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateProfilePayload) => authService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
        },
    })
}

export const useUpdateAvatar = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (file: File) => authService.updateAvatar(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
        },
    })
}

export const useFinancialScore = () => {
    return useQuery({
        queryKey: ["financialScore"],
        queryFn: () => authService.getFinancialScore(),
        select: (res) => res.data,
    })
}

export const useLogout = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { logout } = useAuthStore()

    return () => {
        localStorage.removeItem("token")
        logout()
        queryClient.clear()
        router.push("/auth/login")
    }
}
