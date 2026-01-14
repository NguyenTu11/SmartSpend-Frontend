import { api } from "@/lib/axios"
import {
    ChatPayload,
    ChatSendResponse,
    ChatHistoryResponse,
    FeedbackPayload,
    ChatMessage
} from "@/types/chat"

export const chatService = {
    sendMessage: (data: ChatPayload) =>
        api.post<ChatSendResponse>("/chat", data),

    getHistory: (params?: { page?: number; limit?: number }) =>
        api.get<ChatHistoryResponse>("/chat/history", { params }),

    sendFeedback: (id: string, data: FeedbackPayload) =>
        api.patch<ChatMessage>(`/chat/${id}/feedback`, data),
}
