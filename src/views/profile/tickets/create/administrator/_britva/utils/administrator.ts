import { Qualification } from "@v/profile/tickets/create/administrator/_britva/definitions/administrator"
import i18n from "@/plugins/i18n"

export function qualificationName(value: Qualification): string {
    switch (value) {
        case Qualification.Senior:
            return i18n.global.t("mc.ticket.adminQualification.senior")
        case Qualification.Manager:
            return i18n.global.t("mc.ticket.adminQualification.manager")
        default:
            return value
    }
}
