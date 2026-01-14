"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, X, Info } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
}

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

const colorMap = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
}

const iconColorMap = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
}

export function Toast({ message, type = "info", duration = 4000, onClose }: ToastProps) {
    const Icon = iconMap[type]

    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colorMap[type]}`}>
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorMap[type]}`} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

interface ToastItem {
    id: string
    message: string
    type: ToastType
}

let toastIdCounter = 0
let addToastFn: ((toast: Omit<ToastItem, "id">) => void) | null = null

export function showToast(message: string, type: ToastType = "info") {
    if (addToastFn) {
        addToastFn({ message, type })
    }
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    useEffect(() => {
        addToastFn = (toast) => {
            const id = `toast-${++toastIdCounter}`
            setToasts((prev) => [...prev, { ...toast, id }])
        }

        return () => {
            addToastFn = null
        }
    }, [])

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    )
}
