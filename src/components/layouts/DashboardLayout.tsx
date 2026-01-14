"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Topbar } from "@/components/Topbar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <Topbar
                sidebarCollapsed={sidebarCollapsed}
                onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className={cn(
                "pt-16 min-h-screen transition-all duration-300",
                sidebarCollapsed ? "pl-16" : "pl-64",
                "max-md:pl-0"
            )}>
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
