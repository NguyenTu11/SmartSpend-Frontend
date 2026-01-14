export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    name: string
    email: string
    password: string
}

export interface VerifyEmailPayload {
    email: string
    code: string
}

export interface User {
    _id: string
    email: string
    name: string
    avatar?: {
        url: string
        publicId: string
    }
    bio?: string
    isVerified: boolean
    currency: string
    language: string
    createdAt: string
    updatedAt: string
}

export interface AuthResponse {
    token: string
    user: User
}

export interface MessageResponse {
    message: string
}
