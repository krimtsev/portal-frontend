import { Qualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import i18n from "@/plugins/i18n"

export function qualificationName(value: Qualification): string {
    switch (value) {
        case Qualification.BarberPlus:
            return i18n.global.t("mc.ticket.barberQualification.barberPlus")
        case Qualification.TobBarber:
            return i18n.global.t("mc.ticket.barberQualification.tobBarber")
        case Qualification.TobBarberPlus:
            return i18n.global.t("mc.ticket.barberQualification.tobBarberPlus")
        case Qualification.BrandBarber:
            return i18n.global.t("mc.ticket.barberQualification.brandBarber")
        case Qualification.BrandBarberPlus:
            return i18n.global.t("mc.ticket.barberQualification.brandBarberPlus")
        case Qualification.BrandBarberPro:
            return i18n.global.t("mc.ticket.barberQualification.brandBarberPro")
        case Qualification.Expert:
            return i18n.global.t("mc.ticket.barberQualification.expert")
        default:
            return value
    }
}
