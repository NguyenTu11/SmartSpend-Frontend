import { api } from "@/lib/axios"
import { OcrScanPayload, OcrScanResponse } from "@/types/ocr"

export const ocrService = {
    scanReceipt: (data: OcrScanPayload) =>
        api.post<OcrScanResponse>("/ocr/scan", data),
}
