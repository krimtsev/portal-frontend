import { Partner } from "@/definitions/partner"
import i18n from "@/plugins/i18n"
import { type SpecialistQualification } from "@v/profile/tickets/create/specialist/definitions/specialist"
import { BarberQualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"
import { BarberQualificationTranslate } from "@v/profile/tickets/create/specialist/_britva/utils/specialist-utils"
import {
    LapkiQualificationTranslate,
    LapkiQualification,
} from "@v/profile/tickets/create/specialist/_lapki/utils/specialist-utils"


const QUALIFICATION_TRANSLATE_MAP: Record<SpecialistQualification, string> = {
    ...BarberQualificationTranslate,
    ...LapkiQualificationTranslate,
}

export const PARTNER_QUALIFICATIONS: Partial<Record<Partner, SpecialistQualification[]>> = {
    [Partner.Britva]: Object.values(BarberQualification),
    [Partner.Lapki]:  Object.values(LapkiQualification),
}

export function getActiveQualifications(partner: Partner): SpecialistQualification[] {
    return PARTNER_QUALIFICATIONS[partner] || []
}

export function specialistQualificationName(value: SpecialistQualification): string {
    const translationKey = QUALIFICATION_TRANSLATE_MAP[value]
    return translationKey ? i18n.global.t(translationKey) : value
}
