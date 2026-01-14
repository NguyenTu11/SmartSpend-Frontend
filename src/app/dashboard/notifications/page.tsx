"use client"

import { useState } from "react"
import { Bell, Check, CheckCheck, Trash2, ArrowRightLeft } from "lucide-react"
import {
    useNotifications,
    useMarkAsRead,
    useMarkAllAsRead,
    useDeleteNotification
} from "@/hooks/useNotification"
import { useRespondBudgetTransfer } from "@/hooks/useBudgetTransfer"
import { Button } from "@/components/Button"
import { ShimmerList } from "@/components/ShimmerLoading"
import { showToast } from "@/components/Toast"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { formatRelativeTime } from "@/lib/utils"

export default function NotificationsPage() {
    const { data: notificationsData, isLoading } = useNotifications()
    const markAsReadMutation = useMarkAsRead()
    const markAllMutation = useMarkAllAsRead()
    const deleteMutation = useDeleteNotification()
    const respondTransferMutation = useRespondBudgetTransfer()

    const [pendingResponses, setPendingResponses] = useState<Record<string, "approve" | "reject">>({})
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const notifications = notificationsData?.data || []
    const unreadCount = notificationsData?.unreadCount || 0

    const handleMarkAsRead = (id: string) => {
        markAsReadMutation.mutate(id)
    }

    const handleMarkAllAsRead = () => {
        markAllMutation.mutate(undefined, {
            onSuccess: () => showToast("Đã đánh dấu tất cả đã đọc", "success"),
        })
    }

    const handleDelete = () => {
        if (!deleteId) return
        deleteMutation.mutate(deleteId, {
            onSuccess: () => {
                showToast("Đã xóa", "success")
                setDeleteId(null)
            },
        })
    }

    const handleTransferResponse = (transferId: string, action: "approve" | "reject") => {
        setPendingResponses(prev => ({ ...prev, [transferId]: action }))
        respondTransferMutation.mutate(
            { id: transferId, data: { action } },
            {
                onSuccess: () => {
                    showToast(
                        action === "approve" ? "Đã chấp nhận" : "Đã từ chối",
                        "success"
                    )
                    setPendingResponses(prev => {
                        const next = { ...prev }
                        delete next[transferId]
                        return next
                    })
                },
                onError: () => {
                    setPendingResponses(prev => {
                        const next = { ...prev }
                        delete next[transferId]
                        return next
                    })
                    showToast("Có lỗi xảy ra", "error")
                },
            }
        )
    }

    const getNotificationStyle = (type: string) => {
        switch (type) {
            case "budget_exceeded":
                return { bg: "bg-red-50", icon: "text-red-600" }
            case "budget_warning":
                return { bg: "bg-yellow-50", icon: "text-yellow-600" }
            case "budget_transfer_request":
                return { bg: "bg-blue-50", icon: "text-blue-600" }
            case "budget_transfer_approved":
                return { bg: "bg-green-50", icon: "text-green-600" }
            case "budget_transfer_rejected":
                return { bg: "bg-gray-50", icon: "text-gray-600" }
            case "anomaly":
                return { bg: "bg-orange-50", icon: "text-orange-600" }
            default:
                return { bg: "bg-gray-50", icon: "text-gray-600" }
        }
    }

    const getNotificationIcon = (type: string) => {
        if (type.includes("transfer")) {
            return <ArrowRightLeft className="w-5 h-5" />
        }
        return <Bell className="w-5 h-5" />
    }

    return (
        <div className="space-y-4 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                    <p className="text-sm text-gray-500">
                        {unreadCount > 0 ? `${unreadCount} chưa đọc` : "Không có thông báo mới"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMarkAllAsRead}
                        isLoading={markAllMutation.isPending}
                        leftIcon={<CheckCheck className="w-4 h-4" />}
                    >
                        Đọc tất cả
                    </Button>
                )}
            </div>

            {isLoading ? (
                <ShimmerList count={5} />
            ) : notifications.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Không có thông báo</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const style = getNotificationStyle(notification.type)
                        const isTransferRequest = notification.type === "budget_transfer_request"
                        const transferId = notification.data?.transferId as string | undefined
                        const transferStatus = notification.data?.status as string | undefined
                        const isPending = transferId ? pendingResponses[transferId] : undefined
                        const isProcessed = transferStatus === "approved" || transferStatus === "rejected"

                        return (
                            <div
                                key={notification._id}
                                className={`bg-white rounded-xl border transition-all ${notification.isRead ? "border-gray-100" : "border-blue-200 bg-blue-50/30"}`}
                            >
                                <div className="p-4">
                                    <div className="flex gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                                            <span className={style.icon}>
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatRelativeTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification._id)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Đánh dấu đã đọc"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setDeleteId(notification._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {isTransferRequest && transferId && (
                                        <div className="mt-3 ml-13 pl-13">
                                            {!isProcessed && !isPending ? (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleTransferResponse(transferId, "approve")}
                                                    >
                                                        Chấp nhận
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleTransferResponse(transferId, "reject")}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </div>
                                            ) : isPending ? (
                                                <p className="text-sm text-blue-600 font-medium">
                                                    Đang xử lý...
                                                </p>
                                            ) : (
                                                <p className={`text-sm font-medium ${transferStatus === "approved" ? "text-green-600" : "text-gray-500"}`}>
                                                    {transferStatus === "approved" ? "✓ Đã chấp nhận" : "✗ Đã từ chối"}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Xóa thông báo"
                message="Bạn có chắc chắn muốn xóa thông báo này?"
                isLoading={deleteMutation.isPending}
            />
        </div>
    )
}
