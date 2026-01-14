import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { chatService } from "@/services/chatService"
import { ChatPayload, FeedbackPayload } from "@/types/chat"

export const useChatHistory = () => {
    return useQuery({
        queryKey: ["chatHistory"],
        queryFn: () => chatService.getHistory(),
        select: (res) => res.data.data,
    })
}

export const useSendMessage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: ChatPayload) => chatService.sendMessage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatHistory"] })
        },
    })
}

export const useSendFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FeedbackPayload }) =>
            chatService.sendFeedback(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatHistory"] })
        },
    })
}
