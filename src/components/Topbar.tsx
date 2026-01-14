"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Bell, Search, LogOut, Menu, X, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useLogout, useProfile } from "@/hooks/useAuth"
import { useNotifications } from "@/hooks/useNotification"
import { transactionService } from "@/services/transactionService"
import { Transaction } from "@/types/transaction"
import { cn, formatCurrency } from "@/lib/utils"

interface TopbarProps {
    sidebarCollapsed: boolean
    onMenuClick: () => void
}

export function Topbar({ sidebarCollapsed, onMenuClick }: TopbarProps) {
    const router = useRouter()
    const logout = useLogout()
    const { data: user } = useProfile()
    const { data: notifications } = useNotifications()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Transaction[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    const unreadCount = notifications?.unreadCount || 0

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([])
                return
            }
            setIsSearching(true)
            try {
                const res = await transactionService.getAll({ limit: 20 })
                const filtered = res.data.data.filter((tx) => {
                    const categoryName = typeof tx.categoryId === "object" ? tx.categoryId?.name?.toLowerCase() : ""
                    const query = searchQuery.toLowerCase()
                    return categoryName.includes(query) || tx.amount.toString().includes(query)
                })
                setSearchResults(filtered.slice(0, 5))
            } catch {
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleResultClick = (txId: string) => {
        setShowResults(false)
        setSearchQuery("")
        router.push(`/dashboard/transactions?highlight=${txId}`)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setShowResults(false)
            router.push(`/dashboard/transactions?search=${encodeURIComponent(searchQuery)}`)
            setSearchQuery("")
        }
    }

    const getAvatarUrl = () => {
        if (user?.avatar?.url) return user.avatar.url
        return "/images/user_default.png"
    }

    return (
        <header className={cn(
            "fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300",
            sidebarCollapsed ? "left-16" : "left-64",
            "max-md:left-0"
        )}>
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div ref={searchRef} className="relative hidden sm:block">
                        <form onSubmit={handleSearchSubmit}>
                            <div className={cn(
                                "flex items-center gap-2 rounded-xl px-4 py-2.5 w-64 lg:w-80 transition-all duration-200",
                                "bg-gray-50 outline-none",
                                "focus-within:bg-white focus-within:shadow-md"
                            )}>
                                <Search className={cn(
                                    "w-4 h-4 transition-colors flex-shrink-0",
                                    showResults ? "text-blue-500" : "text-gray-400"
                                )} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setShowResults(true)
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    placeholder="Tìm kiếm giao dịch..."
                                    className="bg-transparent text-sm text-gray-600 placeholder-gray-400 w-full"
                                    style={{ outline: "none", border: "none", boxShadow: "none" }}
                                />
                                {isSearching && (
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>
                        </form>

                        {showResults && searchQuery.trim().length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                {searchResults.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        {isSearching ? "Đang tìm kiếm..." : "Không tìm thấy kết quả"}
                                    </div>
                                ) : (
                                    <>
                                        {searchResults.map((tx) => (
                                            <button
                                                key={tx._id}
                                                onClick={() => handleResultClick(tx._id)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                                    tx.type === "income" ? "bg-green-100" : "bg-red-100"
                                                )}>
                                                    {tx.type === "income" ? (
                                                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {typeof tx.categoryId === "object" ? tx.categoryId?.name : "Khác"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                                                    </p>
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-semibold",
                                                    tx.type === "income" ? "text-green-600" : "text-red-600"
                                                )}>
                                                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                                </span>
                                            </button>
                                        ))}
                                        <Link
                                            href={`/dashboard/transactions?search=${encodeURIComponent(searchQuery)}`}
                                            onClick={() => {
                                                setShowResults(false)
                                                setSearchQuery("")
                                            }}
                                            className="block p-3 text-center text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 font-medium"
                                        >
                                            Xem tất cả kết quả →
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard/notifications"
                        className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <img
                                src={getAvatarUrl()}
                                alt={user?.name || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </button>

                        {showUserMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                                        <p className="font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard/settings"
                                        className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        Cài đặt tài khoản
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false)
                                            logout()
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showMobileMenu && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileMenu(false)}>
                    <div className="w-64 h-full bg-white" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="font-bold text-xl">VIMO</span>
                            <button onClick={() => setShowMobileMenu(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

