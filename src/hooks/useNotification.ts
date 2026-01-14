import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "@/services/notificationService"

export const useNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationService.getAll(),
        select: (res) => res.data,
        refetchInterval: 30000,
    })
}

export const useMarkAsRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })
}

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })
}

export const useDeleteNotification = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => notificationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })
}
