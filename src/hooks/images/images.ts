type ImagesMap = Record<string, string>

const images: ImagesMap = import.meta.glob("@a/images/**/*", {
    eager: true,
    query: "?url",
    import: "default",
})

export const imageSrc = (scr?: string) => {
    if (!scr) return ""
    if (scr?.startsWith("http")) return scr

    const matchingEntry = Object.entries(images).find(([key]) =>
        key.endsWith(`/${scr}`)
    )

    if (!matchingEntry) return ""

    return matchingEntry[1] as string
}
