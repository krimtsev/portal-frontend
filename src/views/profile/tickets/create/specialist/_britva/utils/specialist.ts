import { Qualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import i18n from "@/plugins/i18n"

export function qualificationName(value: Qualification): string {
    switch (value) {
        case Qualification.BarberPlus:
            return i18n.global.t("mc.ticket.qualification.barberPlus")
        case Qualification.TobBarber:
            return i18n.global.t("mc.ticket.qualification.tobBarber")
        case Qualification.TobBarberPlus:
            return i18n.global.t("mc.ticket.qualification.tobBarberPlus")
        case Qualification.BrandBarber:
            return i18n.global.t("mc.ticket.qualification.brandBarber")
        case Qualification.BrandBarberPlus:
            return i18n.global.t("mc.ticket.qualification.brandBarberPlus")
        case Qualification.BrandBarberPro:
            return i18n.global.t("mc.ticket.qualification.brandBarberPro")
        case Qualification.Expert:
            return i18n.global.t("mc.ticket.qualification.expert")
        default:
            return value
    }
}
