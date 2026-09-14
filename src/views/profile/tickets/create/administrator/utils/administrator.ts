import { AdminQualification } from "@v/profile/tickets/create/administrator/definitions/administrator"
import i18n from "@/plugins/i18n"

const QUALIFICATION_TRANSLATE_MAP: Record<AdminQualification, string> = {
    [AdminQualification.Senior]:  "mc.ticket.adminQualification.senior",
    [AdminQualification.Manager]: "mc.ticket.adminQualification.manager",
}

export function adminQualificationName(value: AdminQualification): string {
    const translationKey = QUALIFICATION_TRANSLATE_MAP[value]
    return translationKey ? i18n.global.t(translationKey) : value
}
