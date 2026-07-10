import { DateTime } from "luxon"
import {
    AttributeDisplayType,
    TicketMessageType,
    TicketState,
    TicketType,
    type FieldConfig,
    type TicketDetails,
    type TicketEvent,
    type TicketTimeline,
    type Attribute,
} from "@v/profile/tickets/edit/definitions/ticket"
import { stateName } from "@v/profile/tickets/list/utils/ticket"
import i18n from "@/plugins/i18n"
import { useDepartmentStore } from "@s/department/department"
import { maxLinkLength } from "@/constants/link"

const FIELD_LABELS: Record<string, string> = {
    title:         "Тема",
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

const attributeLabel = (type?: TicketType, key?: string): string => {
    if (!type || !key) return ""
    return i18n.global.t(`mc.ticket.${type}.placeholder.${key}`)
}

export function normalizeAttributes(details: TicketDetails) {
    const rawAttributes = details?.attributes || {}
    const ticketType = details?.type

    if (!ticketType || !TICKET_FIELDS_ORDER[ticketType]) {
        return []
    }

    const fieldsConfig = TICKET_FIELDS_ORDER[ticketType]
    const list: Attribute[] = []

    for (const field of fieldsConfig) {
        const rawValue = rawAttributes[field.key]

        if (!rawValue) {
            continue
        }

        let value = String(rawValue)

        if (field.displayType === AttributeDisplayType.DateTime) {
            value = DateTime.fromISO(value, { zone: "utc" })
                .toFormat("yyyy-MM-dd H:mm")
        }

        if (field.displayType === AttributeDisplayType.Date) {
            value = DateTime.fromISO(value, { zone: "utc" })
                .toFormat("yyyy-MM-dd")
        }

        let text = ""
        if (field.displayType === AttributeDisplayType.Link) {
            text = value.length > maxLinkLength
                ? `${value.slice(0, maxLinkLength)}...`
                : value
        }

        if (field.key === "qualification") {
            const qualificationKey = value[0].toLowerCase() + value.slice(1)

            if (ticketType === TicketType.Specialist) {
                value = i18n.global.t(`mc.ticket.barberQualification.${qualificationKey}`)
            } else if (ticketType === TicketType.Administrator) {
                value = i18n.global.t(`mc.ticket.adminQualification.${qualificationKey}`)
            }
        }

        list.push({
            key:         field.key,
            label:       attributeLabel(ticketType, field.key),
            value,
            text,
            displayType: field.displayType ?? AttributeDisplayType.Text,
        })
    }

    return list
}

export function checkActiveState(value: TicketState) {
    return [
        TicketState.New,
        TicketState.Waiting,
        TicketState.InProgress,
    ].includes(value)
}

export const TICKET_FIELDS_ORDER: Record<string, FieldConfig[]> = {
    [TicketType.Administrator]: [
        { key: "name" },
        { key: "qualification" },
        { key: "phone", displayType: AttributeDisplayType.Phone },
        { key: "experience" },
    ],
    [TicketType.Blacklist]: [
        { key: "name" },
        { key: "phone", displayType: AttributeDisplayType.Phone },
        { key: "duration" },
    ],
    [TicketType.Certificate]: [
        { key: "name" },
        { key: "code" },
        { key: "sum" },
        { key: "paymentDate", displayType: AttributeDisplayType.DateTime },
    ],
    [TicketType.Design]: [
        { key: "name" },
        { key: "phone", displayType: AttributeDisplayType.Phone },
        { key: "format" },
        { key: "promotion" },
        { key: "registration", displayType: AttributeDisplayType.Link },
        { key: "instagram", displayType: AttributeDisplayType.Link },
        { key: "telegram", displayType: AttributeDisplayType.Link },
        { key: "website", displayType: AttributeDisplayType.Link },
        { key: "yandexMap", displayType: AttributeDisplayType.Link },
        { key: "twoGisMap", displayType: AttributeDisplayType.Link },
    ],
    [TicketType.Flagman]: [
        { key: "returnRate" },
        { key: "auditScore" },
        { key: "mastersCount" },
        { key: "openingDate", displayType: AttributeDisplayType.Date },
        { key: "cosmeticBrands" },
        { key: "missedReports" },
        { key: "yandexMap", displayType: AttributeDisplayType.Link },
        { key: "twoGisMap", displayType: AttributeDisplayType.Link },
    ],
    [TicketType.Specialist]: [
        { key: "name" },
        { key: "phone", displayType: AttributeDisplayType.Phone },
        { key: "qualification" },
        { key: "experience" },
        { key: "statistics" },
        { key: "linkToWorks", displayType: AttributeDisplayType.Link },
    ],
}
