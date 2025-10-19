type SvgMap = Record<string, string>

const items: SvgMap = import.meta.glob("@a/svg/**/*", {
    eager: true,
    query: "?raw",
    import: "default",
})

export const svgSrc = (name?: string) => {
    if (!name) return ""

    const matchingEntry = Object.entries(items).find(([key]) =>
        key.endsWith(`/${name}.svg`)
    )

    if (!matchingEntry) return ""

    return matchingEntry[1] as string
}
