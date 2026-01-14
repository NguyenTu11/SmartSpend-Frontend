import Link from "next/link"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © {currentYear} VIMO. All rights reserved.
                    </p>

                    <nav className="flex items-center gap-6">
                        <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                            Chính sách bảo mật
                        </Link>
                        <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                            Điều khoản sử dụng
                        </Link>
                        <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
                            Liên hệ
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
