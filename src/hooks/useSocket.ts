"use client"

import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"
import { ENV } from "@/lib/env"
import { showToast } from "@/components/Toast"

export function useSocket(userId?: string) {
    const socketRef = useRef<Socket | null>(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!userId) return

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!token) return

        socketRef.current = io(ENV.SOCKET_URL, {
            auth: { token },
            transports: ["websocket", "polling"],
        })

        socketRef.current.on("connect", () => {
            socketRef.current?.emit("join", userId)
        })

        socketRef.current.on("notification", (data: { title: string; message: string }) => {
            showToast(data.title, "info")
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        })

        socketRef.current.on("budget_warning", () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
        })

        socketRef.current.on("budget_exceeded", () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
        })

        socketRef.current.on("transaction_created", () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["transactionSummary"] })
        })

        return () => {
            socketRef.current?.disconnect()
            socketRef.current = null
        }
    }, [userId, queryClient])

    return socketRef.current
}
