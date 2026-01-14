"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ToastContainer } from "@/components/Toast"
import { useProfile } from "@/hooks/useAuth"
import { useSocket } from "@/hooks/useSocket"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { data: user } = useProfile()

    useSocket(user?._id)
    usePageTitle()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/auth/login")
        }
    }, [router])

    return (
        <DashboardLayout>
            {children}
            <ToastContainer />
        </DashboardLayout>
    )
}
