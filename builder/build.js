import fs from "node:fs"
import path from "node:path"
import url from "node:url"
import deepMerge from "deepmerge"
import copy from "recursive-copy"
import {
    throwError,
    logInfo,
    createDirectory,
    removeDirectory
} from "./utils/utils.js"
import env from "./../env.js"
import chokidar from "chokidar"
import { spawn } from "child_process"

const isProduction = process.env.NODE_ENV === "production"
const isDevelop = process.env.NODE_ENV === "develop"
const partner = env.app.partner

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "..", "src")
const generatedDir = path.resolve(__dirname, "..", ".generated")
const partnersAssetsDir = path.resolve(srcDir, "assets", "_partners")

const defaultCopyOptions = {
    dot: true,
    overwrite: true,
    filter: [
        '**/*',
    ]
}

if (!partner) {
    throwError("Partner is not defined")
}

removeDirectory(generatedDir)
createDirectory(generatedDir)

async function build() {
    logInfo(`⚙️ Start build for ${partner}:`);

    mergeLocales()
    await copyPrimeConfig()
    await copyStyles()
    mergeImages()
    await copyPublic()
    await copyFonts()
}

(async () => {
    await build()

    if (isDevelop) {
        await watchDevChanges()
    }
})()

function mergeLocales() {
    logInfo(`Merge locales:`);
    const commonDir = path.resolve(partnersAssetsDir, "common", "locales")
    const partnerDir = path.resolve(partnersAssetsDir, partner, "locales")
    const outDir = path.resolve(generatedDir, "assets", "locales")

    createDirectory(outDir)

    const locales = fs.readdirSync(commonDir);

    for (const locale of locales) {
        const commonPath = path.join(commonDir, locale)
        const partnerPath = path.join(partnerDir, locale)
        const outputPath = path.join(outDir, locale)

        const commonJson = JSON.parse(fs.readFileSync(commonPath, 'utf8'))
        const partnerJson = fs.existsSync(partnerPath)
            ? JSON.parse(fs.readFileSync(partnerPath, 'utf8'))
            : {};

        const merged = deepMerge(commonJson, partnerJson)

        fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf8');
        logInfo(`✔️ Merged ${locale}`);
    }
}

async function copyStyles() {
    logInfo(`Copy styles:`);

    const stylesDir = path.resolve(partnersAssetsDir, "common", "styles")
    const outputStyle = path.resolve(generatedDir, "assets", "styles")

    createDirectory(outputStyle)

    try {
        const results = await copy(stylesDir, outputStyle, defaultCopyOptions)
        logInfo(`✔️ ${results.length} files copied`)
    } catch (error) {
        throwError(`Error copying files ${error}`)
    }
}

async function copyPrimeConfig() {
    logInfo(`Copy prime config:`);

    const partnerDir = path.resolve(partnersAssetsDir, partner, "prime")
    const outDir = path.resolve(generatedDir, "assets", "prime")

    createDirectory(outDir)

    try {
        const results = await copy(partnerDir, outDir, defaultCopyOptions)
        logInfo(`✔️ ${results.length} files copied`)
    } catch (error) {
        throwError(`Error copying files ${error}`)
    }
}

function mergeImages() {
    logInfo(`Merge images:`);

    const commonDir = path.resolve(partnersAssetsDir, "common", "images");
    const partnerDir = path.resolve(partnersAssetsDir, partner, "images");
    const outDir = path.resolve(generatedDir, "assets", "images");

    createDirectory(outDir);

    // Рекурсивно собираем все файлы из директории
    function collectFilesRecursively(dir, base = '') {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        let files = [];

        for (const entry of entries) {
            const relPath = path.join(base, entry.name);
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files = files.concat(collectFilesRecursively(fullPath, relPath));
            } else {
                files.push(relPath);
            }
        }

        return files;
    }

    const commonFiles = fs.existsSync(commonDir) ? collectFilesRecursively(commonDir) : [];
    const partnerFiles = fs.existsSync(partnerDir) ? collectFilesRecursively(partnerDir) : [];

    const allFiles = new Set([...commonFiles, ...partnerFiles]);

    for (const file of allFiles) {
        const partnerFilePath = path.join(partnerDir, file);
        const commonFilePath = path.join(commonDir, file);
        const outputFilePath = path.join(outDir, file);

        const outputDirPath = path.dirname(outputFilePath);
        if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true });
        }

        if (fs.existsSync(partnerFilePath)) {
            fs.copyFileSync(partnerFilePath, outputFilePath);
        } else if (fs.existsSync(commonFilePath)) {
            fs.copyFileSync(commonFilePath, outputFilePath);
        }
    }

    logInfo(`✔️ Merged images ${allFiles.size}`);
}

async function copyPublic() {
    logInfo(`Copy public files:`);

    const partnerDir = path.resolve(partnersAssetsDir, partner, "public")
    const outDir = path.resolve(__dirname, "..", "public", "partner")

    createDirectory(outDir)

    try {
        const results = await copy(partnerDir, outDir, defaultCopyOptions)
        logInfo(`✔️ ${results.length} files copied`)
    } catch (error) {
        throwError(`Error copying files ${error}`)
    }
}

async function copyFonts() {
    logInfo(`Copy fonts files:`);

    const fontsDir = path.resolve(partnersAssetsDir, "common", "fonts")
    const outDir = path.resolve(generatedDir, "assets", "fonts")

    createDirectory(outDir)

    try {
        const results = await copy(fontsDir, outDir, defaultCopyOptions)
        logInfo(`✔️ ${results.length} files copied`)
    } catch (error) {
        throwError(`Error copying files ${error}`)
    }
}

async function watchDevChanges() {
    const watcher = chokidar.watch(partnersAssetsDir, {
        persistent: true, // держим процесс работы
        ignoreInitial: true, // игнорируем события при старте
        awaitWriteFinish: true, // ждем завершения записи файла
    });

    // Стартуем Vite
    const vite = spawn('npx', ['vite'], {
        stdio: 'inherit', // чтобы видеть вывод Vite в консоли
        shell: true
    });

    vite.on('close', (code) => {
        console.log(`Vite process exited with code ${code}`);
    });

    watcher
        .on('add', (filePath) => {
            console.log(`File added: ${filePath}`);
            rebuild(filePath); // Запуск сборки при добавлении нового файла
        })
        .on('change', (filePath, stats, prevStats, prevPath) => {
            console.log(`File changed: ${filePath}`);
            rebuild(filePath); // Запуск сборки при изменении файла
        })
        .on('unlink', (filePath) => {
            console.log(`File removed: ${filePath}`);
            rebuild(filePath); // Запуск сборки при удалении файла
        })
        .on('error', (error) => {
            console.error(`Watcher error: ${error}`);
        });

    logInfo(`💫 Watching for file changes in ...`);
}

// Функция для перезапуска сборки
async function rebuild(filePath) {
    const dirName = path.basename(path.dirname(filePath));
    logInfo(`🔄 Rebuilding ${dirName} ...`);
    switch (dirName) {
        case "locales":
            await mergeLocales()
            break;
        case "styles":
            await copyStyles()
            break;
        case "prime":
            await copyPrimeConfig()
            break;
        case "images":
            await mergeImages()
            break;
        case "public":
            await copyPublic()
            break;
        default:
            await build()
    }

}
