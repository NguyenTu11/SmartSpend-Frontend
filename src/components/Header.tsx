"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    Bell,
    Menu,
    X,
    LogOut,
    Settings
} from "lucide-react"
import { useLogout, useProfile } from "@/hooks/useAuth"
import { useNotifications } from "@/hooks/useNotification"

const DEFAULT_AVATAR = "/images/user_default.png"

export function Header() {
    const pathname = usePathname()
    const logout = useLogout()
    const { data: user } = useProfile()
    const { data: notifications } = useNotifications()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const unreadCount = notifications?.unreadCount || 0

    const getAvatarUrl = () => {
        if (user?.avatar?.url) return user.avatar.url
        return DEFAULT_AVATAR
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Image
                            src="/images/logo_mivo.png"
                            alt="VIMO Logo"
                            width={36}
                            height={36}
                            className="w-9 h-9 object-contain"
                        />
                        <span className="font-bold text-xl text-gray-900">VIMO</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                            Tổng quan
                        </NavLink>
                        <NavLink href="/dashboard/transactions" active={pathname === "/dashboard/transactions"}>
                            Giao dịch
                        </NavLink>
                        <NavLink href="/dashboard/budgets" active={pathname === "/dashboard/budgets"}>
                            Ngân sách
                        </NavLink>
                        <NavLink href="/dashboard/analytics" active={pathname === "/dashboard/analytics"}>
                            Thống kê
                        </NavLink>
                        <NavLink href="/dashboard/chat" active={pathname === "/dashboard/chat"}>
                            AI Chat
                        </NavLink>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/notifications"
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                            >
                                <img
                                    src={getAvatarUrl()}
                                    alt={user?.name || "User"}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </button>

                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-medium text-gray-900 truncate">{user?.name || "Người dùng"}</p>
                                            <p className="text-sm text-gray-500 truncate">{user?.email || ""}</p>
                                        </div>
                                        <Link
                                            href="/dashboard/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Cài đặt
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false)
                                                logout()
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {showMobileMenu && (
                    <nav className="md:hidden py-4 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                            <MobileNavLink href="/dashboard" active={pathname === "/dashboard"} onClick={() => setShowMobileMenu(false)}>
                                Tổng quan
                            </MobileNavLink>
                            <MobileNavLink href="/dashboard/transactions" active={pathname === "/dashboard/transactions"} onClick={() => setShowMobileMenu(false)}>
                                Giao dịch
                            </MobileNavLink>
                            <MobileNavLink href="/dashboard/budgets" active={pathname === "/dashboard/budgets"} onClick={() => setShowMobileMenu(false)}>
                                Ngân sách
                            </MobileNavLink>
                            <MobileNavLink href="/dashboard/analytics" active={pathname === "/dashboard/analytics"} onClick={() => setShowMobileMenu(false)}>
                                Thống kê
                            </MobileNavLink>
                            <MobileNavLink href="/dashboard/chat" active={pathname === "/dashboard/chat"} onClick={() => setShowMobileMenu(false)}>
                                AI Chat
                            </MobileNavLink>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
        >
            {children}
        </Link>
    )
}

function MobileNavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`px-4 py-3 rounded-lg font-medium ${active
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
                }`}
        >
            {children}
        </Link>
    )
}
