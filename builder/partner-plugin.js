import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

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
        async transformIndexHtml(html) {
            let transformed = html;
            const rootDir = process.cwd();

            const partnerConfigPath = path.resolve(rootDir, "src", "assets", "_partners", partnerName, "config.js");
            let themeClass = "dark-mode";

            if (fs.existsSync(partnerConfigPath)) {
                try {
                    const fileUrl = pathToFileURL(partnerConfigPath);
                    fileUrl.search = `?t=${Date.now()}`;

                    const customConfigModule = await import(fileUrl.href);
                    const customConfig = customConfigModule.default || customConfigModule;

                    if (customConfig.theme === "light") {
                        themeClass = "light-mode";
                    } else if (customConfig.theme === "dark") {
                        themeClass = "dark-mode";
                    }
                } catch (error) {
                    console.error(`[Plugin Error] Не удалось прочитать config.js для ${partnerName}:`, error);
                }
            }

            transformed = transformed.replace(/<html[^>]*>/, `<html lang="ru" class="${themeClass}">`);

            const localePath = path.resolve(rootDir, ".build", partnerName, "assets", "locales", "ru-RU.json");
            if (fs.existsSync(localePath)) {
                try {
                    const localeData = JSON.parse(fs.readFileSync(localePath, "utf8"));
                    const title = localeData?.mc?.partner?.title || "Portal"
                    if (title) {
                        transformed = transformed.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
                    }
                } catch (error) {
                    console.error(`[Plugin Error] Не удалось прочитать ru-RU.json для ${partnerName}:`, error);
                }
            }

            return transformed;
        }
    }
}
