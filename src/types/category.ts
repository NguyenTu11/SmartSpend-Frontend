export type CategoryType = "income" | "expense"

export interface Category {
    _id: string
    userId: string
    name: string
    parentId?: string
    keywords?: string[]
    createdAt?: string
    updatedAt?: string
    type?: CategoryType
}

export interface CategoryPayload {
    name: string
    parentId?: string
    keywords?: string[]
    type?: CategoryType
}
