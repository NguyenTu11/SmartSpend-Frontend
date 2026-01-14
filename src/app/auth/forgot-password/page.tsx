"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { authService } from "@/services/authService"
import { showToast } from "@/components/Toast"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await authService.forgotPassword(email)
            sessionStorage.setItem("resetEmail", email)
            showToast("Mã xác nhận đã được gửi đến email của bạn", "success")
            router.push("/auth/reset-password")
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>
            setError(axiosErr.response?.data?.message || "Có lỗi xảy ra")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden px-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-25"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <Link href="/auth/login" className="flex justify-center mb-6">
                    <div className="w-32 h-32 relative">
                        <Image
                            src="/images/logo_mivo.png"
                            alt="VIMO Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white">Quên mật khẩu</h1>
                        <p className="text-white/60 mt-2">Nhập email để nhận mã xác nhận</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email của bạn"
                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Gửi mã xác nhận
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
