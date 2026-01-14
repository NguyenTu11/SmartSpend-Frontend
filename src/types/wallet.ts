export interface Wallet {
    _id: string
    userId: string
    name: string
    balance: number
    currency: string
    icon?: string
    color?: string
    createdAt: string
    updatedAt: string
}

export interface WalletPayload {
    name: string
    balance?: number
    currency?: string
    icon?: string
    color?: string
}

export interface WalletListResponse {
    success: boolean
    data: Wallet[]
}
