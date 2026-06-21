export function partnerPlugin(partnerName, partnerConfig) {
    const virtualModuleId = "virtual:partner"
    const resolvedVirtualModuleId = "\0" + virtualModuleId

    return {
        name: "partner-plugin",
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return `export default ${JSON.stringify({ name: partnerName, ...partnerConfig })}`
            }
        },
    }
}
