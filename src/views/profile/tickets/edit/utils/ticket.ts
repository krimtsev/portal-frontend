import type { TicketEvent } from "@v/profile/tickets/edit/definitions/ticket"
import { stateName } from "@v/profile/tickets/list/utils/ticket"

const FIELD_LABELS: Record<string, string> = {
    state: "Статус",
    category: "Отдел",
    partner: "Партнёр",
};

export function formatChanges(item: TicketEvent): string[] {
    const message: string[] = []

    if (item.user?.name) {
        message.push(`${item.user.name} внес(ла) изменения:`)
    }

    if (item.changes) {
        for (const key of Object.keys(item.changes)) {
            const change = item.changes[key]
            const label = FIELD_LABELS[key] || key
            if (key === "state") {
                message.push(`${label}: ${stateName(change.old as string)} → ${stateName(change.new as string)}`)
            } else {
                message.push(`${label}: ${change.old} → ${change.new}`)
            }
        }
    }

    return message
}
