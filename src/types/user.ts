export interface User {
    _id: string
    name: string
    email: string
    avatar?: {
        url: string
        publicId: string
    }
    bio?: string
    currency?: string
    language?: string
    createdAt: string
}

export interface UpdateProfilePayload {
    name?: string
    bio?: string
    currency?: string
    language?: string
    avatarImage?: string
}

export interface FinancialScoreComponent {
    name: string
    score: number
    maxScore: number
    description?: string
}

export interface FinancialScoreResponse {
    score: number
    grade: string
    components: FinancialScoreComponent[]
    recommendations: string[]
    calculatedAt: string
}
