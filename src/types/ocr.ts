export interface OcrExtractedData {
    amount?: number
    date?: string
    description?: string
    suggestedCategory?: string
    confidence: number
}

export interface OcrScanPayload {
    image: string
    saveImage?: boolean
}

export interface OcrCategory {
    _id: string
    name: string
}

export interface OcrScanResponse {
    success: boolean
    extractedData?: OcrExtractedData
    imageUrl?: string
    matchedCategoryId?: string
    availableCategories: OcrCategory[]
}
