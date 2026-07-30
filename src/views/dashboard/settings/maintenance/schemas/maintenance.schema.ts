import { z } from "zod"
import { toTypedSchema } from "@vee-validate/zod"

export const MaintenanceSchema = toTypedSchema(
    z.object({
        enabled: z.boolean(),
    }),
)
