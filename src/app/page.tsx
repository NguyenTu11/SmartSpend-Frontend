"use client"

import Link from "next/link"
import Image from "next/image"
import { LogIn, UserPlus } from "lucide-react"
import { Footer } from "@/components/Footer"

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <div className="flex-1 flex items-center justify-center relative px-4 py-8">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="orb-1 absolute top-10 left-5 sm:top-20 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
                    <div className="orb-2 absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-pink-600 rounded-full blur-3xl opacity-25"></div>
                    <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 sm:w-80 h-56 sm:h-80 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
                </div>

                <div className="text-center relative z-10 w-full max-w-lg">
                    <div className="mb-6 sm:mb-10 flex justify-center">
                        <div className="logo-rotate w-40 h-40 sm:w-64 sm:h-64 relative">
                            <Image
                                src="/images/logo_mivo.png"
                                alt="VIMO Logo"
                                width={256}
                                height={256}
                                className="w-full h-full object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <h1 className="title-float text-5xl sm:text-7xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-wider">
                        VIMO
                    </h1>
                    <p className="text-gray-300 text-base sm:text-xl mb-8 sm:mb-12 font-light tracking-wide px-4">Quản lý chi tiêu thông minh cùng với AI</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link
                            href="/auth/login"
                            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-base sm:text-lg font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 btn-shimmer opacity-0 group-hover:opacity-30"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                <LogIn className="w-5 h-5" />
                                Đăng nhập
                            </span>
                        </Link>
                        <Link
                            href="/auth/login?mode=register"
                            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-transparent text-white text-base sm:text-lg font-bold rounded-2xl border-2 border-white/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/20"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 btn-shimmer opacity-0 group-hover:opacity-20"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                Đăng ký
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
