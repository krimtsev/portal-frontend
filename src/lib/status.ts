import { Status } from "@/definitions/status"

export function boolToStatus(status: boolean | null | undefined): Status | null {
    if (status === true) return Status.ACTIVE
    if (status === false) return Status.DISABLED
    return null
}

export function statusToBool(status: Status | null | undefined): boolean | null {
    if (status === Status.ACTIVE) return true
    if (status === Status.DISABLED) return false
    return null
}

export function disabledToStatus(disabled: boolean | null | undefined): Status | null {
    if (disabled === true) return Status.DISABLED
    if (disabled === false) return Status.ACTIVE
    return null
}

export function statusToDisabled(status: Status | null | undefined): boolean | null {
    if (status === Status.DISABLED) return true
    if (status === Status.ACTIVE) return false
    return null
}
