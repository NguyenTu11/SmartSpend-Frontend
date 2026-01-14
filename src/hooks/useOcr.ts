import { useMutation } from "@tanstack/react-query"
import { ocrService } from "@/services/ocrService"
import { OcrScanPayload } from "@/types/ocr"

export const useScanReceipt = () => {
    return useMutation({
        mutationFn: (data: OcrScanPayload) => ocrService.scanReceipt(data),
    })
}
