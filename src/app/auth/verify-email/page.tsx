"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { AxiosError } from "axios"
import { Mail } from "lucide-react"
import { useVerifyEmail } from "@/hooks/useAuth"
import { Button } from "@/components/Button"

export default function VerifyEmailPage() {
    const { mutate: verifyEmail, isPending, error, isSuccess } = useVerifyEmail()
    const [email, setEmail] = useState("")
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("verifyEmail")
        if (storedEmail) {
            setEmail(storedEmail)
        }
        inputRefs.current[0]?.focus()
    }, [])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("")
            const newCode = [...code]
            pastedCode.forEach((char, i) => {
                if (index + i < 6 && /^\d$/.test(char)) {
                    newCode[index + i] = char
                }
            })
            setCode(newCode)
            const nextIndex = Math.min(index + pastedCode.length, 5)
            inputRefs.current[nextIndex]?.focus()
            return
        }

        if (!/^\d*$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (pastedData) {
            const newCode = [...code]
            pastedData.split("").forEach((char, i) => {
                if (i < 6) newCode[i] = char
            })
            setCode(newCode)
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const fullCode = code.join("")
        if (fullCode.length === 6) {
            verifyEmail({ email, code: fullCode })
        }
    }

    const axiosError = error as AxiosError<{ message: string }> | null
    const errorMessage = axiosError?.response?.data?.message || (error ? "Xác thực thất bại" : "")

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden px-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="orb-1 absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
                <div className="orb-2 absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-25"></div>
                <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <Link href="/" className="flex justify-center mb-2">
                    <div className="logo-rotate w-32 h-32 relative">
                        <Image
                            src="/images/logo_mivo.png"
                            alt="VIMO Logo"
                            width={128}
                            height={128}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>
                </Link>

                <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider text-center">
                    VIMO
                </h1>
                <p className="text-gray-400 text-sm mb-4 text-center">Xác thực email của bạn</p>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-300 text-sm">
                            Nhập mã 6 số đã gửi đến
                        </p>
                        <p className="text-violet-400 font-medium">{email || "email của bạn"}</p>
                    </div>

                    {isSuccess && (
                        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                            <p className="text-sm text-green-300 text-center">
                                Xác thực thành công! Đang chuyển hướng...
                            </p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                            <p className="text-sm text-red-300 text-center">{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-300 ${digit
                                        ? "bg-gradient-to-br from-violet-600/30 to-pink-600/30 border-violet-500 text-white scale-105 code-input-filled"
                                        : "bg-white/10 border-white/20 text-white hover:border-white/40"
                                        } focus:border-violet-500 focus:scale-105`}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            isLoading={isPending}
                            disabled={code.some(d => !d)}
                            className="w-full py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:opacity-90 transition-opacity rounded-xl font-semibold disabled:opacity-50"
                        >
                            Xác thực
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <p className="text-gray-400 text-sm">
                            Không nhận được mã?{" "}
                            <button type="button" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                                Gửi lại
                            </button>
                        </p>
                        <Link href="/auth/login" className="block text-gray-400 text-sm hover:text-white transition-colors">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
