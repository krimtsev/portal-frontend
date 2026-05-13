import { DateTime } from "luxon"
import {
    type TicketDetails,
    type TicketEvent,
    TicketMessageType,
    TicketState,
    type TicketTimeline,
    TicketType,
} from "@v/profile/tickets/edit/definitions/ticket"
import { stateName } from "@v/profile/tickets/list/utils/ticket"
import i18n from "@/plugins/i18n"
import { useDepartmentStore } from "@s/department/department"

const FIELD_LABELS: Record<string, string> = {
    state:         "Статус",
    department_id: "Отдел",
    partner:       "Партнёр",
}

export function formatChanges(item: TicketEvent): string[] {
    const departmentStore = useDepartmentStore()

    const message: string[] = []

    if (item.user?.name) {
        message.push(`${item.user.name} внес(ла) изменения:`)
    }

    if (item.changes) {
        for (const key of Object.keys(item.changes)) {
            const change = item.changes[key]
            const label = FIELD_LABELS[key] || key

            let newValue = String(change.new)
            let oldValue = String(change.old)

            switch (key) {
                case "state":
                    newValue = stateName(newValue)
                    oldValue = stateName(oldValue)
                    break
                case "department_id":
                    newValue = departmentStore.getTitleById(newValue)
                    oldValue = departmentStore.getTitleById(oldValue)
                    break
            }

            message.push(`${label}: ${oldValue} → ${newValue}`)
        }
    }

    return message
}

export function hasTimelineMessage(timeline: TicketTimeline) {
    return timeline.some((item) => {
        return (
            (item.type === TicketMessageType.Message && (item?.text || item?.files?.length)) ||
            (item.type === TicketMessageType.Event && Object.keys(item.changes).length)
        )
    })
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
                    .toFormat("dd-MM-yyyy H:mm:ss")
            }

            if (
                details.type === TicketType.Flagman &&
                label === "openingDate"
            ) {
                value = DateTime.fromISO(value, { zone: "utc" })
                    .toFormat("dd-MM-yyyy")
            }

            if (
                details.type === TicketType.Specialist &&
                label === "qualification"
            ) {
                const qualification = value[0].toLowerCase() + value.slice(1)
                value = i18n.global.t(`mc.ticket.barberQualification.${qualification}`)
            }

            if (
                details.type === TicketType.Administrator &&
                label === "qualification"
            ) {
                const qualification = value[0].toLowerCase() + value.slice(1)
                value = i18n.global.t(`mc.ticket.adminQualification.${qualification}`)
            }

            return {
                label: attributeLabel(label),
                value,
            }
        })
}

export function checkActiveState(value: TicketState) {
    return [
        TicketState.New,
        TicketState.Waiting,
        TicketState.InProgress,
    ].includes(value)
}
