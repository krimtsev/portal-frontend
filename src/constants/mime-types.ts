export const MIME_TYPES = {
    IMAGES: [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/tiff",
    ],
    DOCS: [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/postscript",
    ],
    VIDEO: [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
    ],
    AUDIO: [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/aac",
        "audio/x-m4a",
    ],
    ARCHIVES: [
        "application/zip",
        "application/x-zip-compressed",
        "application/x-7z-compressed",
    ],
}

export const IMAGE_ACCEPT = MIME_TYPES.IMAGES.join(",")

export const ALL_ACCEPT = [
    ...MIME_TYPES.IMAGES,
    ...MIME_TYPES.DOCS,
    ...MIME_TYPES.VIDEO,
    ...MIME_TYPES.AUDIO,
    ...MIME_TYPES.ARCHIVES,
].join(",")


