import {
    type TicketDetails,
    type TicketEvent,
    TicketMessageType,
    type TicketTimeline,
    TicketType
} from "@v/profile/tickets/edit/definitions/ticket"
import { stateName } from "@v/profile/tickets/list/utils/ticket"
import { DateTime } from "luxon"
import i18n from "@/plugins/i18n"

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

export function hasTimelineMessage(timeline: TicketTimeline) {
    return timeline.some(item =>
        item.type === TicketMessageType.Message && (item?.text || item?.files?.length) ||
        item.type === TicketMessageType.Event && Object.keys(item.changes).length
    )
}

export function normalizeAttributes(details: TicketDetails) {
    const attributeLabel = (key?: string): string => {
        if (!details) return ""

        const type = details.type
        if (!type || !key) return ""

        return i18n.global.t(`mc.ticket.${type}.placeholder.${key}`)
    }

    return Object.entries(details?.attributes || {})
        .filter(([_, value]) => !!value)
        .map(([label, value]) => {
            if (
                details.type === TicketType.Certificate &&
                label === "paymentDate"
            ) {
                value = DateTime.fromISO(value, { zone: "utc" })
                    .toFormat("dd.MM.yyyy H:mm:ss")
            }

            if (
                details.type === TicketType.Specialist &&
                label === "qualification"
            ) {
                const qualification = value[0].toLowerCase() + value.slice(1)
                value = i18n.global.t(`mc.ticket.qualification.${qualification}`)
            }

            return {
                label: attributeLabel(label),
                value
            }
        })
}
