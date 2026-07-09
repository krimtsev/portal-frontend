import { DateTime, IANAZone } from "luxon"

export function isSupportedTimezone(id: string): boolean {
    try {
        const now = DateTime.now()
            .setZone(id)
            .toMillis()
        const zone = new IANAZone(id)
        const offset = zone.offset(now)
        return zone.isValid && !isNaN(offset)
    } catch (e) {
        console.warn(e)
        return false
    }
}

