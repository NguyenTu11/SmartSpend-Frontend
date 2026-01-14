export type NotificationType =
    | "budget_warning"
    | "budget_exceeded"
    | "budget_transfer_request"
    | "budget_transfer_approved"
    | "budget_transfer_rejected"
    | "recurring_transaction"
    | "system"

export interface Notification {
    _id: string
    userId: string
    type: NotificationType
    title: string
    message: string
    isRead: boolean
    data?: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export interface NotificationListResponse {
    success: boolean
    data: Notification[]
    unreadCount: number
}
