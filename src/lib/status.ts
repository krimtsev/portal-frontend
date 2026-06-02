import { Status } from "@/definitions/status"

export function boolToStatus(disabled: boolean | null | undefined): Status | null {
    if (disabled === true) return Status.DISABLED
    if (disabled === false) return Status.ACTIVE
    return null
}

export function statusToBool(status: Status | null | undefined): boolean | null {
    if (status === Status.DISABLED) return true
    if (status === Status.ACTIVE) return false
    return null
}
