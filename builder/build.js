import fs from "node:fs"
import path from "node:path"
import url from "node:url"
import { spawn } from "node:child_process"
import deepMerge from "deepmerge"
import copy from "recursive-copy"
import {
    throwError,
    logInfo,
    logDebug,
    createDirectory,
    removeDirectory,
    killPort,
} from "./utils/utils.js"
import env from "./../env.js"
import chokidar from "chokidar"


const isProduction = process.env.NODE_ENV === "production"
const isDevelop = process.env.NODE_ENV === "develop"
const partner = env.app.partner

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const srcDir = path.resolve(__dirname, "..", "src")
const generatedDir = path.resolve(__dirname, "..", ".generated")
const partnersAssetsDir = path.resolve(srcDir, "assets", "_partners")

const defaultCopyOptions = {
    dot:       true,
    overwrite: true,
    filter:    [
        "**/*",
    ],
}

if (!partner) {
    throwError("Partner is not defined")
}

removeDirectory(generatedDir)
createDirectory(generatedDir)

async function build() {
    logInfo(`⚙️ Start build for ${partner}:`)

    mergeLocales()
    await copyFilesToAssets("prime", partner)
    await copyFilesToAssets("styles")
    await copyFilesToAssets("fonts")
    await copyFilesToAssets("svg")
    mergeFiles("images")
    await copyPublic()
}

(async () => {
    await build()

    if (isDevelop) {
        await watchDevChanges()
    }
})()

function mergeLocales() {
    const commonDir = path.resolve(partnersAssetsDir, "common", "locales")
    const partnerDir = path.resolve(partnersAssetsDir, partner, "locales")
    const outDir = path.resolve(generatedDir, "assets", "locales")

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
        logInfo(`✔️ locale: ${locale} merged`)
    }
}

async function copyFilesToAssets(dir, partner = "common") {
    const sourceDir = path.resolve(partnersAssetsDir, partner, dir)
    const outputDir = path.resolve(generatedDir, "assets", dir)

    createDirectory(outputDir)

    try {
        const results = await copy(sourceDir, outputDir, defaultCopyOptions)
        logInfo(`✔️ ${dir}: ${results.length} files copied`)
    } catch (error) {
        throwError(`Error copying files ${error}`)
    }
}

function mergeFiles(type) {
    const commonDir = path.resolve(partnersAssetsDir, "common", type)
    const partnerDir = path.resolve(partnersAssetsDir, partner, type)
    const outDir = path.resolve(generatedDir, "assets", type)

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

    logInfo(`✔️ ${type}: ${allFiles.size} merged`)
}

async function copyPublic() {
    const partnerDir = path.resolve(partnersAssetsDir, partner, "public")
    const outDir = path.resolve(__dirname, "..", "public", "partner")

    createDirectory(outDir)

    try {
        const results = await copy(partnerDir, outDir, defaultCopyOptions)
        logInfo(`✔️ public: ${results.length} files copied`)
    } catch (error) {
        throwError(`Error copying files ${error}`)
    }
}

async function watchDevChanges() {
    killPort(env.app.port)

    const watcher = chokidar.watch(partnersAssetsDir, {
        persistent:       true, // держим процесс работы
        ignoreInitial:    true, // игнорируем события при старте
        awaitWriteFinish: true, // ждем завершения записи файла
    })

    // Стартуем Vite
    const vite = spawn("npx", ["vite"], {
        stdio:    "inherit", // показываем логи Vite в терминале
        shell:    true,      // чтобы работало одинаково на Windows и Unix
        detached: false,   // не отделяем от родительского процесса
    })

    const cleanExit = () => {
        logInfo("🛑 Terminating watcher and Vite...")

        // Останавливаем файловый watcher
        watcher.close()
        if (!vite.killed) {
            vite.kill()
        }
        process.exit(0)
    }

    process.on("SIGINT", cleanExit)
    process.on("SIGTERM", cleanExit)
    process.on("SIGHUP", cleanExit) // Завершам при закрытии редактора
    process.on("exit", cleanExit) // Завершение при нажатии Ctrl+C или завершении процесса

    vite.on("error", (err) => {
        console.error("❌ Vite process error:", err)
        cleanExit()
    })

    vite.on("exit", (code, signal) => {
        console.log(`⚡ Vite exited with code ${code} and signal ${signal}`)
        cleanExit()
    })

    watcher
        .on("add", (filePath) => {
            console.log(`File added: ${filePath}`)
            // Запуск сборки при добавлении нового файла
            rebuild(filePath)
        })
        .on("change", (filePath, stats, prevStats, prevPath) => {
            console.log(`File changed: ${filePath}`)
            // Запуск сборки при изменении файла
            rebuild(filePath)
        })
        .on("unlink", (filePath) => {
            console.log(`File removed: ${filePath}`)
            // Запуск сборки при удалении файла
            rebuild(filePath)
        })
        .on("error", (error) => {
            console.error(`Watcher error: ${error}`)
        })

    logInfo("💫 Watching for file changes in ...")
    logDebug(`▶️ Vite started with PID: ${vite.pid}`)
}

// Функция для перезапуска сборки
async function rebuild(filePath) {
    const dirName = path.basename(path.dirname(filePath))
    logInfo(`🔄 Rebuilding ${dirName} ...`)
    switch (dirName) {
        case "locales":
            await mergeLocales()
            break
        case "styles":
            await copyFilesToAssets(dirName)
            break
        case "prime":
            await copyFilesToAssets(dirName, partner)
            break
        case "images":
            await mergeFiles(dirName)
            break
        case "docs":
            await mergeFiles(dirName)
            break
        case "public":
            await copyPublic()
            break
        default:
            await build()
    }
}
