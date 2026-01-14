export type FeedbackType = "like" | "dislike"

export interface ChatMessage {
    _id: string
    userId: string
    message: string
    response: string
    feedback?: FeedbackType
    tokenUsage?: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
    createdAt: string
    updatedAt?: string
}

export interface ChatPayload {
    message: string
}

export interface ChatSendResponse {
    _id: string
    message: string
    response: string
    tokenUsage?: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
    createdAt: string
}

export interface ChatHistoryResponse {
    data: ChatMessage[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface FeedbackPayload {
    feedback: FeedbackType
}
