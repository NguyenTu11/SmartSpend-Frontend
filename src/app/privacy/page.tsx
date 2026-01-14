"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react"

export default function PrivacyPage() {
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
                        <h1 className="text-3xl font-bold text-white">Chính sách bảo mật</h1>
                        <p className="text-gray-400">Cập nhật lần cuối: 14/01/2026</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 space-y-8">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Database className="w-5 h-5 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">1. Thông tin chúng tôi thu thập</h2>
                        </div>
                        <div className="text-gray-300 space-y-3 ml-13">
                            <p>Khi bạn sử dụng VIMO, chúng tôi thu thập:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li><strong>Thông tin tài khoản:</strong> Email, tên, ảnh đại diện</li>
                                <li><strong>Dữ liệu tài chính:</strong> Giao dịch, ngân sách, danh mục chi tiêu</li>
                                <li><strong>Dữ liệu sử dụng:</strong> Cách bạn tương tác với ứng dụng</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <Lock className="w-5 h-5 text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">2. Cách chúng tôi bảo vệ dữ liệu</h2>
                        </div>
                        <div className="text-gray-300 space-y-3 ml-13">
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>Mã hóa dữ liệu khi truyền tải (HTTPS/TLS)</li>
                                <li>Mật khẩu được băm bằng bcrypt</li>
                                <li>Token xác thực JWT với thời hạn giới hạn</li>
                                <li>Không lưu trữ thông tin thẻ ngân hàng</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <Eye className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">3. Cách chúng tôi sử dụng dữ liệu</h2>
                        </div>
                        <div className="text-gray-300 space-y-3 ml-13">
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>Cung cấp và cải thiện dịch vụ VIMO</li>
                                <li>Phân tích chi tiêu và đề xuất thông minh từ AI</li>
                                <li>Gửi thông báo về ngân sách và giao dịch</li>
                                <li>Hỗ trợ kỹ thuật khi bạn cần</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-pink-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">4. Quyền của bạn</h2>
                        </div>
                        <div className="text-gray-300 space-y-3 ml-13">
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>Truy cập và xem dữ liệu cá nhân</li>
                                <li>Chỉnh sửa thông tin tài khoản</li>
                                <li>Xuất dữ liệu giao dịch</li>
                                <li>Xóa tài khoản và toàn bộ dữ liệu</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">5. Liên hệ</h2>
                        </div>
                        <div className="text-gray-300 ml-13">
                            <p>Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:</p>
                            <p className="mt-2 text-violet-400">tunguyenvan1110@gmail.com</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
