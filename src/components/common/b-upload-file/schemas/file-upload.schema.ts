import * as z from "zod"
import {
    DEFAULT_MAX_SIZE_MB,
    DEFAULT_FILES_LIMIT,
    megabytesToBytes
} from "@c/common/b-upload-file/utils/b-file-upload"

const MAX_FILE_SIZE = megabytesToBytes(DEFAULT_MAX_SIZE_MB)
const MAX_FILES = DEFAULT_FILES_LIMIT

export const FilesSchema = z
    .array(z.instanceof(File))
    .max(MAX_FILES, `Максимум ${MAX_FILES} файлов`)
    .superRefine((files, ctx) => {
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: "custom",
                    message: `Файл "${file.name}" слишком большой. Максимум ${DEFAULT_MAX_SIZE_MB}MB`,
                })
            }
        }
    })
    .optional()
