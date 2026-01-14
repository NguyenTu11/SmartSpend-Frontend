"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/Button"
import { authService } from "@/services/authService"
import { showToast } from "@/components/Toast"

export default function ResetPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail")
        if (!storedEmail) {
            router.push("/auth/forgot-password")
            return
        }
        setEmail(storedEmail)
    }, [router])

    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value.slice(-1)
        setCode(newCode)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        const newCode = [...code]
        pastedData.split("").forEach((char, i) => {
            if (i < 6) newCode[i] = char
        })
        setCode(newCode)
        if (pastedData.length === 6) {
            inputRefs.current[5]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const fullCode = code.join("")
        if (fullCode.length !== 6) {
            setError("Vui lòng nhập đủ 6 số")
            return
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp")
            return
        }

        setIsLoading(true)
        try {
            await authService.resetPassword(email, fullCode, newPassword)
            sessionStorage.removeItem("resetEmail")
            showToast("Đặt lại mật khẩu thành công!", "success")
            router.push("/auth/login")
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
                        <h1 className="text-2xl font-bold text-white">Đặt lại mật khẩu</h1>
                        <p className="text-white/60 mt-2">Nhập mã xác nhận và mật khẩu mới</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white/60 text-sm mb-2 text-center">Mã xác nhận</label>
                            <div className="flex justify-center gap-2">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className={`w-12 h-14 text-center text-2xl font-bold bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${digit ? "border-purple-500 scale-105" : "border-white/20"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mật khẩu mới"
                                className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Xác nhận mật khẩu"
                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Đặt lại mật khẩu
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/auth/forgot-password"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Gửi lại mã
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
