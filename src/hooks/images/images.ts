type ImagesMap = Record<string, string>

const images: ImagesMap = import.meta.glob("@a/images/**/*", {
    eager: true,
    query: "?url",
    import: "default",
})

export const imageSrc = (avatar?: string) => {
    if (!avatar) return ""
    if (avatar?.startsWith("http")) return avatar

    const matchingEntry = Object.entries(images).find(([key]) =>
        key.endsWith(`/${avatar}`)
    )

    if (!matchingEntry) return ""

    return matchingEntry[1] as string
}
