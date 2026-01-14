"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
    "/dashboard": "Tổng quan",
    "/dashboard/transactions": "Giao dịch",
    "/dashboard/budgets": "Ngân sách",
    "/dashboard/analytics": "Phân tích",
    "/dashboard/chat": "AI Chat",
    "/dashboard/notifications": "Thông báo",
    "/dashboard/settings": "Cài đặt",
}

export function usePageTitle() {
    const pathname = usePathname()

    useEffect(() => {
        const pageTitle = pageTitles[pathname] || "VIMO"
        document.title = pageTitle === "VIMO" ? "VIMO" : `${pageTitle} | VIMO`
    }, [pathname])
}
