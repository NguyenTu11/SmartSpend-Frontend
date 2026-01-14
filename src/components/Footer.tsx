import Link from "next/link"
import { BookOpen, Shield, FileText, Sparkles } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-transparent">

            <div className="relative max-w-7xl mx-auto px-6 py-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm font-medium">© {currentYear} VIMO</span>
                    </div>

                    <nav className="flex items-center gap-1">
                        <Link
                            href="/guide"
                            className="px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-1.5"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hướng dẫn</span>
                        </Link>
                        <span className="text-white/20">•</span>
                        <Link
                            href="/privacy"
                            className="px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-1.5"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Bảo mật</span>
                        </Link>
                        <span className="text-white/20">•</span>
                        <Link
                            href="/terms"
                            className="px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-1.5"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Điều khoản</span>
                        </Link>
                    </nav>

                    <div className="text-white/50 text-xs flex items-center gap-1">
                        <span>Made with</span>
                        <span>by NguyenTu11</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
