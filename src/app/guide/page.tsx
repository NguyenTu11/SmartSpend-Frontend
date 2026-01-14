"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, UserPlus, LayoutDashboard, CreditCard, PiggyBank, MessageSquare, Bell, Settings } from "lucide-react"

export default function GuidePage() {
    const steps = [
        {
            icon: UserPlus,
            color: "blue",
            title: "Bước 1: Đăng ký tài khoản",
            description: "Tạo tài khoản miễn phí với email hoặc Google",
            details: [
                "Truy cập trang đăng ký",
                "Nhập email và mật khẩu (ít nhất 6 ký tự)",
                "Kiểm tra email để lấy mã xác thực 6 số",
                "Nhập mã để hoàn tất đăng ký"
            ]
        },
        {
            icon: LayoutDashboard,
            color: "purple",
            title: "Bước 2: Khám phá Dashboard",
            description: "Xem tổng quan tài chính của bạn",
            details: [
                "Tổng thu/chi trong tháng hiển thị ở trên cùng",
                "Biểu đồ chi tiêu theo ngày giúp theo dõi xu hướng",
                "Phân tích chi tiêu theo danh mục với biểu đồ tròn",
                "Giao dịch gần đây để quick review"
            ]
        },
        {
            icon: CreditCard,
            color: "green",
            title: "Bước 3: Thêm giao dịch",
            description: "Ghi lại mọi khoản thu chi",
            details: [
                "Bấm nút '+' hoặc vào trang Giao dịch",
                "Chọn loại: Thu nhập hoặc Chi tiêu",
                "Nhập số tiền và chọn danh mục",
                "Thêm ghi chú hoặc hình ảnh (tùy chọn)",
                "Bấm Lưu để hoàn tất"
            ]
        },
        {
            icon: PiggyBank,
            color: "yellow",
            title: "Bước 4: Thiết lập ngân sách",
            description: "Kiểm soát chi tiêu với giới hạn",
            details: [
                "Vào trang Ngân sách từ menu",
                "Bấm 'Thêm ngân sách mới'",
                "Chọn danh mục (VD: Ăn uống, Giải trí)",
                "Đặt số tiền giới hạn cho tháng",
                "Nhận cảnh báo khi sắp vượt ngân sách"
            ]
        },
        {
            icon: MessageSquare,
            color: "pink",
            title: "Bước 5: Nhờ AI tư vấn",
            description: "Chat với AI để được hỗ trợ",
            details: [
                "Vào trang Chat AI từ menu",
                "Hỏi bất kỳ câu hỏi về tài chính",
                "VD: 'Tôi nên tiết kiệm bao nhiêu mỗi tháng?'",
                "AI sẽ phân tích dữ liệu và đưa gợi ý",
                "Nhận lời khuyên cá nhân hóa"
            ]
        },
        {
            icon: Bell,
            color: "orange",
            title: "Bước 6: Theo dõi thông báo",
            description: "Nhận cảnh báo quan trọng",
            details: [
                "Thông báo khi ngân sách sắp hết",
                "Cảnh báo khi chi tiêu bất thường",
                "Nhắc nhở giao dịch định kỳ",
                "Bấm vào chuông để xem tất cả"
            ]
        },
        {
            icon: Settings,
            color: "gray",
            title: "Bước 7: Tùy chỉnh cài đặt",
            description: "Cá nhân hóa trải nghiệm",
            details: [
                "Cập nhật ảnh đại diện và tên",
                "Đổi mật khẩu khi cần",
                "Quản lý danh mục chi tiêu",
                "Xuất dữ liệu để backup"
            ]
        }
    ]

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string }> = {
            blue: { bg: "bg-blue-500/20", text: "text-blue-400" },
            purple: { bg: "bg-purple-500/20", text: "text-purple-400" },
            green: { bg: "bg-green-500/20", text: "text-green-400" },
            yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
            pink: { bg: "bg-pink-500/20", text: "text-pink-400" },
            orange: { bg: "bg-orange-500/20", text: "text-orange-400" },
            gray: { bg: "bg-gray-500/20", text: "text-gray-400" }
        }
        return colors[color] || colors.gray
    }

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
                        <h1 className="text-3xl font-bold text-white">Hướng dẫn sử dụng</h1>
                        <p className="text-gray-400">Bắt đầu quản lý tài chính thông minh</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">👋 Chào mừng đến với VIMO!</h2>
                    <p className="text-gray-300">
                        VIMO giúp bạn theo dõi chi tiêu, lập ngân sách và đạt mục tiêu tài chính với sự hỗ trợ của AI.
                        Làm theo các bước dưới đây để bắt đầu.
                    </p>
                </div>

                <div className="space-y-6">
                    {steps.map((step, index) => {
                        const colors = getColorClasses(step.color)
                        const Icon = step.icon
                        return (
                            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                                        <ul className="space-y-2">
                                            {step.details.map((detail, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                                    <span className={`${colors.text} font-medium`}>•</span>
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Bắt đầu ngay 🚀
                    </Link>
                </div>
            </div>
        </div>
    )
}
