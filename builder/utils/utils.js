import fs from "node:fs"

export function throwError(text) {
    console.error("\x1b[31m", text)
    process.exit(1)
}

export function logInfo(text) {
    console.info("\x1b[33m", text)
}

export function createDirectory(path) {
    try {
        fs.accessSync(path)
    } catch (e){
        fs.mkdirSync(path, { recursive: true })
    }
}

export function removeDirectory(path) {
    try {
        fs.rmSync(path, { recursive: true })
    } catch (e) {}
}