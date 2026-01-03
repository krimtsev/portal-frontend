import * as z from "zod"

const MAX_FILE_SIZE = 1_000_000
const MAX_FILES = 5

export const filesSchema = z
    .array(z.instanceof(File))
    .max(MAX_FILES, `Максимум ${MAX_FILES} файлов`)
    .superRefine((files, ctx) => {
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: "custom",
                    message: "Файл больше 1MB",
                })
            }
        }
    })
    .optional()

