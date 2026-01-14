import { api } from "@/lib/axios"
import { NotificationListResponse } from "@/types/notification"

export const notificationService = {
    getAll: () =>
        api.get<NotificationListResponse>("/notifications"),

    markAsRead: (id: string) =>
        api.put<{ success: boolean; message: string }>(`/notifications/${id}/read`),

    markAllAsRead: () =>
        api.put<{ success: boolean; message: string }>("/notifications/read-all"),

    delete: (id: string) =>
        api.delete<{ success: boolean; message: string }>(`/notifications/${id}`),
}
