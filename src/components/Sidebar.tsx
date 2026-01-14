"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ArrowRightLeft,
    PiggyBank,
    BarChart3,
    MessageSquare,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
}

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { href: "/dashboard/transactions", icon: ArrowRightLeft, label: "Giao dịch" },
    { href: "/dashboard/budgets", icon: PiggyBank, label: "Ngân sách" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Phân tích" },
    { href: "/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
    { href: "/dashboard/notifications", icon: Bell, label: "Thông báo" },
    { href: "/dashboard/settings", icon: Settings, label: "Cài đặt" },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col",
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <Image
                        src="/images/logo_mivo.png"
                        alt="VIMO"
                        width={36}
                        height={36}
                        className="w-9 h-9 object-contain flex-shrink-0"
                    />
                    {!collapsed && (
                        <span className="font-bold text-xl text-gray-900">VIMO</span>
                    )}
                </Link>
                <button
                    onClick={onToggle}
                    className={cn(
                        "p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors",
                        collapsed && "absolute -right-3 top-6 bg-white border border-gray-200 shadow-sm"
                    )}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", collapsed && "mx-auto")} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {!collapsed && (
                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-900">Cần trợ giúp?</p>
                        <p className="text-xs text-gray-500 mt-1">Chat với AI để được tư vấn tài chính</p>
                        <Link
                            href="/dashboard/chat"
                            className="mt-3 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Bắt đầu chat →
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    )
}
