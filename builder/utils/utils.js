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
    } catch (e){
        fs.mkdirSync(path, { recursive: true })
    }
}

export function removeDirectory(path) {
    try {
        fs.rmSync(path, { recursive: true })
    } catch (e) {
        if (e.code === 'ENOENT') return
        console.error(COLOR_ERROR, "Ошибка при удалении каталога:", path, COLOR_DEFAULT);
        console.error(e);
    }
}

export function killPort(port) {
    if (os.platform() !== "win32") {
        console.log("ℹ️ Kill Port работает только на Windows");
        return;
    }

    try {
        const output = execSync(`netstat -ano | findstr :${port}`, { shell: true }).toString();
        if (!output) {
            console.log(`ℹ️ Нет процессов на порту ${port}`);
            return;
        }

        const lines = output.split("\n").filter(Boolean);
        const killedPIDs = new Set();

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const localAddress = parts[1];
            const pid = parts[parts.length - 1];

            if (
                localAddress.startsWith("127.") ||
                localAddress === "[::]" ||
                localAddress.toLowerCase().startsWith("localhost")
            ) {
                if (!killedPIDs.has(pid)) {
                    execSync(`taskkill /PID ${pid} /F`);
                    killedPIDs.add(pid);
                    console.log(`✅ Процесс ${pid} на порту ${port} удален`);
                }
            }
        }
    } catch (err) {
        console.error(`❌ Ошибка при удалении процессов на порту ${port}:`, err.message);
    }
}
