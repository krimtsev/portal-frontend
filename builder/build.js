import fs from "node:fs"
import path from "node:path"
import url from "node:url"
import { createServer, build } from "vite"
import deepMerge from "deepmerge"
import copy from "recursive-copy"
import { createPartnerConfig } from "./partner-config.js"
import {
    throwError,
    logInfo,
    logDebug,
    createDirectory,
    removeDirectory,
} from "./utils/utils.js"
import env from "./../env.js"

const isProduction = process.env.NODE_ENV === "production"
const isDevelop = process.env.NODE_ENV === "develop"

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const srcDir = path.resolve(__dirname, "..", "src")

const baseGeneratedDir = path.resolve(__dirname, "..", ".build")
const partnersAssetsDir = path.resolve(srcDir, "assets", "_partners")
const basePublicDir = path.resolve(__dirname, "..", "public", "partner")

const defaultCopyOptions = {
    dot:       true,
    overwrite: true,
    filter:    [
        "**/*",
    ],
}

const activePartners = Object.entries(env)
    .map(([name, config]) => ({
        name,
        ...config,
    }))

if (!activePartners.length) {
    throwError("Partners configuration is empty in env.js")
}

const viteServers = []
const dirsToClean = [
    ".build",
    ".temp_cache",
    "dist",
]

;(async () => {
    for (const dir of dirsToClean) {
        removeDirectory(path.resolve(__dirname, "..", dir))
    }

    createDirectory(baseGeneratedDir)

    logInfo(`🚀 Starting pipeline for partners: ${activePartners.map(p => p.name).join(", ")}`)

    await Promise.all(activePartners.map(partner => buildPartner(partner.name)))

    if (isDevelop) {
        await startDevPool(activePartners)
    } else {
    logInfo("📦 Starting production build for each partner...")

    for (const partner of activePartners) {
        logInfo(`🏭 Building Vite app for [${partner.name}]...`)
        await build(createPartnerConfig(partner.name, "production"))
    }

    logInfo("✨ All partners compiled successfully!")
}
})()

async function buildPartner(partnerName) {
    const partnerGenDir = path.resolve(baseGeneratedDir, partnerName)

    createDirectory(partnerGenDir)

    mergeLocales(partnerName, partnerGenDir)
    await copyFilesToAssets("prime", partnerName, partnerGenDir)
    await copyFilesToAssets("styles", partnerName, partnerGenDir)
    await copyFilesToAssets("fonts", partnerName, partnerGenDir)
    await copyFilesToAssets("svg", partnerName, partnerGenDir)
    mergeFiles("images", partnerName, partnerGenDir)
    mergeFiles("docs", partnerName, partnerGenDir)
    await copyPublic(partnerName)

    logInfo(`✅ Initial assets ready for [${partnerName}]`)
}

function mergeLocales(partnerName, partnerGenDir) {
    const commonDir = path.resolve(partnersAssetsDir, "common", "locales")
    const partnerDir = path.resolve(partnersAssetsDir, partnerName, "locales")
    const outDir = path.resolve(partnerGenDir, "assets", "locales")

    createDirectory(outDir)

    const locales = fs.readdirSync(commonDir)

    for (const locale of locales) {
        const commonPath = path.join(commonDir, locale)
        const partnerPath = path.join(partnerDir, locale)
        const outputPath = path.join(outDir, locale)

        const commonJson = JSON.parse(fs.readFileSync(commonPath, "utf8"))
        const partnerJson = fs.existsSync(partnerPath)
            ? JSON.parse(fs.readFileSync(partnerPath, "utf8"))
            : {}

        const merged = deepMerge(commonJson, partnerJson)
        fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), "utf8")
    }
    logInfo(`✔️ [${partnerName}] locales compiled`)
}

async function copyFilesToAssets(dir, partnerName, partnerGenDir) {
    const commonDir = path.resolve(partnersAssetsDir, "common", dir)
    const partnerDir = path.resolve(partnersAssetsDir, partnerName, dir)
    const outputDir = path.resolve(partnerGenDir, "assets", dir)

    createDirectory(outputDir)
    if (fs.existsSync(commonDir)) await copy(commonDir, outputDir, defaultCopyOptions)
    if (fs.existsSync(partnerDir)) await copy(partnerDir, outputDir, defaultCopyOptions)
}

function mergeFiles(type, partnerName, partnerGenDir) {
    const commonDir = path.resolve(partnersAssetsDir, "common", type)
    const partnerDir = path.resolve(partnersAssetsDir, partnerName, type)
    const outDir = path.resolve(partnerGenDir, "assets", type)

    createDirectory(outDir)

    // Рекурсивно собираем все файлы из директории
    function collectFilesRecursively(dir, base = "") {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        let files = []

        for (const entry of entries) {
            const relPath = path.join(base, entry.name)
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                files = files.concat(collectFilesRecursively(fullPath, relPath))
            } else {
                files.push(relPath)
            }
        }

        return files
    }

    const commonFiles = fs.existsSync(commonDir) ? collectFilesRecursively(commonDir) : []
    const partnerFiles = fs.existsSync(partnerDir) ? collectFilesRecursively(partnerDir) : []
    const allFiles = new Set([...commonFiles, ...partnerFiles])

    for (const file of allFiles) {
        const partnerFilePath = path.join(partnerDir, file)
        const commonFilePath = path.join(commonDir, file)
        const outputFilePath = path.join(outDir, file)

        const outputDirPath = path.dirname(outputFilePath)
        if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true })
        }

        if (fs.existsSync(partnerFilePath)) {
            fs.copyFileSync(partnerFilePath, outputFilePath)
        } else if (fs.existsSync(commonFilePath)) {
            fs.copyFileSync(commonFilePath, outputFilePath)
        }
    }

    logInfo(`✔️ [${partnerName}] ${type}: ${allFiles.size} files merged`)
}

async function copyPublic(partnerName) {
    const partnerDir = path.resolve(partnersAssetsDir, partnerName, "public")
    const outDir = path.resolve(basePublicDir, partnerName)

    createDirectory(outDir)

    try {
        const results = await copy(partnerDir, outDir, defaultCopyOptions)
        logInfo(`✔️ [${partnerName}] public: ${results.length} files synchronized`)
    } catch (error) {
        throwError(`Error copying public for ${partnerName}: ${error}`)
    }
}

async function startDevPool(partners) {
    for (const partner of partners) {
        logDebug(`▶️ Initializing Vite Server for [${partner.name}] on ${partner.host}:${partner.port}`)

        const server = await createServer(createPartnerConfig(partner.name, "development"))

        await server.listen()
        viteServers.push(server)
    }

    logInfo("💫 All Vite servers are running inside single process.")

    if (viteServers.length > 0) {
        const masterWatcher = viteServers[0].watcher

        masterWatcher.add(partnersAssetsDir)

        masterWatcher.on("all", async (event, filePath) => {
            const relativePath = path.relative(partnersAssetsDir, filePath)
            const [targetPartner, dirName] = relativePath.split(path.sep)
            if (!dirName) return

            if (targetPartner === "common") {
                for (const p of partners) {
                    await rebuildSpecificStep(dirName, p.name)
                }
            } else if (partners.some(p => p.name === targetPartner)) {
                await rebuildSpecificStep(dirName, targetPartner)
            }

            viteServers.forEach(server => server.ws.send({ type: "full-reload" }))
        })
    }
}

// Функция для перезапуска сборки
async function rebuildSpecificStep(dirName, partnerName) {
    const partnerGenDir = path.resolve(baseGeneratedDir, partnerName)

    switch (dirName) {
        case "locales":
            mergeLocales(partnerName, partnerGenDir)
            break
        case "styles":
        case "prime":
        case "fonts":
        case "svg":
            await copyFilesToAssets(dirName, partnerName, partnerGenDir)
            break
        case "images":
        case "docs":
            mergeFiles(dirName, partnerName, partnerGenDir)
            break
        case "public":
            await copyPublic(partnerName)
            break
        default:
            await buildPartner(partnerName)
    }
}

const cleanExit = async () => {
    logInfo("\n🛑 Shutting down all Vite servers...")
    await Promise.all(viteServers.map(server => server.close()))
    logInfo("✅ All ports released safely. Exiting.")
    process.exit(0)
}

process.on("SIGINT", cleanExit)
process.on("SIGTERM", cleanExit)
