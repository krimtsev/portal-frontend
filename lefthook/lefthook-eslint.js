import { ESLint } from "eslint"
import { execSync } from "node:child_process"


async function removeIgnoredFiles(files) {
    const eslint = new ESLint()
    const ignoredFiles = await Promise.all(files.map((file) => eslint.isPathIgnored(file)))
    const filteredFiles = files.filter((_, i) => !ignoredFiles[i])
    return filteredFiles.join(" ")
}

;(async () => {
    const files = process.argv.slice(2)
    const filesToLint = await removeIgnoredFiles(files)

    if (!filesToLint) {
        process.exit(0)
    }

    try {
        execSync(`npx eslint ${filesToLint} --max-warnings 0 --no-error-on-unmatched-pattern`, {
            stdio: "inherit"
        })
    } catch (e) {
        if (e.stdout) console.log(e.stdout.trim())
        if (e.stderr) console.error(e.stderr.trim())
        process.exit(1)
    }
})()
