import fs from "node:fs"
import { execSync } from "child_process"
import os from "os"

const COLOR_ERROR = "\x1b[31m"
const COLOR_INFO = "\x1b[32m"
const COLOR_DEBUG = "\x1b[94m"
const COLOR_DEFAULT = "\x1b[0m"

export function throwError(text) {
    console.error(COLOR_ERROR, text, COLOR_DEFAULT)
    process.exit(1)
}

export function logInfo(text) {
    console.info(COLOR_INFO, text, COLOR_DEFAULT)
}

export function logDebug(text) {
    console.info(COLOR_DEBUG, text, COLOR_DEFAULT)
}

export function createDirectory(path) {
    try {
        fs.accessSync(path)
    } catch (e) {
        fs.mkdirSync(path, { recursive: true })
    }
}

export function removeDirectory(path) {
    try {
        fs.rmSync(path, { recursive: true })
    } catch (e) {
        if (e.code === "ENOENT") return
        console.error(COLOR_ERROR, "Ошибка при удалении каталога:", path, COLOR_DEFAULT)
        console.error(e)
    }
}
