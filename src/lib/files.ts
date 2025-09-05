import { getUnlocalizedFileName } from "@/lib/utils"

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result?.toString() || "")
        reader.onerror = error => reject(error)
    })
}

export function downloadFile(file: string, filename?: string) {
    const filePath = file
    const link = document.createElement("a")
    link.href = filePath
    link.download = filename ?? getUnlocalizedFileName(filePath)
    console.log(link)
    link.click()
}

export function downloadExternalFile(dataDocument: Blob, filename: string) {
    const dummy = document.createElement("a")
    const url = window.URL.createObjectURL(dataDocument)
    dummy.href = url
    dummy.download = filename
    document.body.appendChild(dummy)
    dummy.click()
    document.body.removeChild(dummy)
    window.URL.revokeObjectURL(url)
}
