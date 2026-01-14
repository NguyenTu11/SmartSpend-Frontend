"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AxiosError } from "axios"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { useLogin, useRegister } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { authService } from "@/services/authService"
import { useAuthStore } from "@/store/authStore"
import { ENV } from "@/lib/env"

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void
                    prompt: () => void
                }
                oauth2: {
                    initTokenClient: (config: any) => { requestAccessToken: () => void }
                }
            }
        }
    }
}

export default function AuthPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLogin, setIsLogin] = useState(true)
    const { mutate: login, isPending: loginPending, error: loginError } = useLogin()
    const { mutate: register, isPending: registerPending, error: registerError } = useRegister()
    const { setToken, setUser } = useAuthStore()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [validationError, setValidationError] = useState("")
    const [googleLoading, setGoogleLoading] = useState(false)

    const handleGoogleResponse = useCallback(async (tokenResponse: any) => {
        if (tokenResponse.access_token) {
            setGoogleLoading(true)
            try {
                const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                })
                const userInfo = await userInfoRes.json()

                const res = await authService.googleLogin(JSON.stringify(userInfo))
                const { token, user } = res.data
                localStorage.setItem("token", token)
                setToken(token)
                setUser(user)
                router.push("/dashboard")
            } catch (err) {
                const axiosErr = err as AxiosError<{ message: string }>
                setValidationError(axiosErr.response?.data?.message || "Đăng nhập Google thất bại")
            } finally {
                setGoogleLoading(false)
            }
        }
    }, [router, setToken, setUser])

    useEffect(() => {
        const mode = searchParams.get("mode")
        if (mode === "register") {
            setIsLogin(false)
        }
    }, [searchParams])

    const handleGoogleClick = () => {
        if (window.google?.accounts?.oauth2) {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: ENV.GOOGLE_CLIENT_ID,
                scope: "openid email profile",
                callback: handleGoogleResponse,
            })
            client.requestAccessToken()
        }
    }


    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login({ email, password })
    }

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError("")

        if (password !== confirmPassword) {
            setValidationError("Mật khẩu xác nhận không khớp")
            return
        }

        if (password.length < 6) {
            setValidationError("Mật khẩu phải có ít nhất 6 ký tự")
            return
        }

        register({ name, email, password })
    }

    const switchForm = () => {
        setIsLogin(!isLogin)
        setValidationError("")
        setEmail("")
        setPassword("")
        setName("")
        setConfirmPassword("")
    }

    const loginAxiosError = loginError as AxiosError<{ message: string }> | null
    const registerAxiosError = registerError as AxiosError<{ message: string }> | null
    const loginErrorMessage = loginAxiosError?.response?.data?.message || (loginError ? "Đăng nhập thất bại" : "")
    const registerErrorMessage = validationError || registerAxiosError?.response?.data?.message || (registerError ? "Đăng ký thất bại" : "")

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden px-4 pb-8">
            <div className="absolute inset-0 overflow-hidden">
                <div className="orb-1 absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
                <div className="orb-2 absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-25"></div>
                <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <Link href="/" className="flex justify-center">
                    <div className="logo-rotate w-40 h-40 relative">
                        <Image
                            src="/images/logo_mivo.png"
                            alt="VIMO Logo"
                            width={160}
                            height={160}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>
                </Link>

                <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider text-center">
                    VIMO
                </h1>
                <p className="text-gray-400 text-sm mb-2 text-center">Quản lý chi tiêu thông minh cùng với AI</p>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
                    <div className="flex mb-6 bg-white/10 rounded-2xl p-1">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${isLogin
                                ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${!isLogin
                                ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Đăng ký
                        </button>
                    </div>

                    <div className="relative overflow-hidden">
                        <div className={`slide-container flex w-[200%] ${isLogin ? "slide-left" : "slide-right"}`}>
                            <div className="w-1/2 px-1 mt-1">
                                {loginErrorMessage && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                                        <p className="text-sm text-red-300">{loginErrorMessage}</p>
                                    </div>
                                )}
                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email của bạn"
                                            className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mật khẩu"
                                            className="pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-violet-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <Link href="/auth/forgot-password" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                    <Button
                                        type="submit"
                                        isLoading={loginPending}
                                        className="w-full py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:opacity-90 transition-opacity rounded-xl font-semibold"
                                    >
                                        Đăng nhập
                                    </Button>
                                </form>
                                <div className="flex items-center my-4">
                                    <div className="flex-1 h-px bg-white/20"></div>
                                    <span className="px-4 text-gray-400 text-sm">hoặc</span>
                                    <div className="flex-1 h-px bg-white/20"></div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGoogleClick}
                                    disabled={googleLoading}
                                    className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-semibold text-white flex items-center justify-center gap-3 hover:bg-white/20 transition-colors disabled:opacity-50"
                                >
                                    {googleLoading ? (
                                        <span>Đang xử lý...</span>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Đăng nhập bằng Google
                                        </>
                                    )}
                                </button>
                                <p className="mt-6 text-center text-gray-400">
                                    Chưa có tài khoản?{" "}
                                    <button type="button" onClick={switchForm} className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                                        Đăng ký ngay
                                    </button>
                                </p>
                            </div>

                            <div className="w-1/2 px-1 mt-1">
                                {registerErrorMessage && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                                        <p className="text-sm text-red-300">{registerErrorMessage}</p>
                                    </div>
                                )}
                                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Họ và tên"
                                            className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email của bạn"
                                            className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mật khẩu"
                                            className="pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-violet-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Xác nhận mật khẩu"
                                            className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        isLoading={registerPending}
                                        className="w-full py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:opacity-90 transition-opacity rounded-xl font-semibold"
                                    >
                                        Đăng ký
                                    </Button>
                                </form>
                                <p className="mt-6 text-center text-gray-400">
                                    Đã có tài khoản?{" "}
                                    <button type="button" onClick={switchForm} className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                                        Đăng nhập
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
