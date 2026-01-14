"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale, RefreshCw } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại trang chủ
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <Image src="/images/logo_mivo.png" alt="VIMO" width={48} height={48} />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Điều khoản sử dụng</h1>
                        <p className="text-gray-400">Cập nhật lần cuối: 14/01/2026</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 space-y-8">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">1. Giới thiệu</h2>
                        </div>
                        <div className="text-gray-300 ml-13">
                            <p>
                                Chào mừng bạn đến với VIMO - ứng dụng quản lý tài chính cá nhân.
                                Bằng việc sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản dưới đây.
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">2. Quyền của bạn</h2>
                        </div>
                        <div className="text-gray-300 space-y-3 ml-13">
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>Tạo tài khoản miễn phí và sử dụng các tính năng cơ bản</li>
                                <li>Quản lý giao dịch, ngân sách, danh mục chi tiêu</li>
                                <li>Sử dụng AI để phân tích và nhận tư vấn tài chính</li>
                                <li>Xuất dữ liệu cá nhân bất cứ lúc nào</li>
                                <li>Xóa tài khoản khi không muốn sử dụng</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">3. Điều cấm</h2>
                        </div>
                        <div className="text-gray-300 space-y-3 ml-13">
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                                <li>Cố gắng truy cập trái phép vào hệ thống</li>
                                <li>Chia sẻ tài khoản với người khác</li>
                                <li>Tạo nhiều tài khoản giả mạo</li>
                                <li>Phát tán mã độc hoặc spam</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">4. Giới hạn trách nhiệm</h2>
                        </div>
                        <div className="text-gray-300 space-y-3 ml-13">
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>VIMO cung cấp công cụ quản lý, không phải tư vấn tài chính chuyên nghiệp</li>
                                <li>AI đưa ra gợi ý dựa trên dữ liệu, không đảm bảo kết quả</li>
                                <li>Chúng tôi không chịu trách nhiệm về quyết định tài chính của bạn</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <Scale className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">5. Quyền sở hữu trí tuệ</h2>
                        </div>
                        <div className="text-gray-300 ml-13">
                            <p>
                                VIMO và tất cả nội dung, tính năng và chức năng là tài sản của chúng tôi
                                và được bảo vệ bởi luật bản quyền và sở hữu trí tuệ.
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-pink-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">6. Thay đổi điều khoản</h2>
                        </div>
                        <div className="text-gray-300 ml-13">
                            <p>
                                Chúng tôi có thể cập nhật điều khoản này bất cứ lúc nào.
                                Thay đổi quan trọng sẽ được thông báo qua email hoặc trong ứng dụng.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
