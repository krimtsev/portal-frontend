import { DefaultQualification } from "@v/profile/tickets/create/specialist/definitions/specialist"

export const LapkiQualification = [
    DefaultQualification.Master,
    DefaultQualification.TopMaster,
    DefaultQualification.BrandMaster,
]

export const LapkiQualificationTranslate: Record<DefaultQualification, string> = {
    [DefaultQualification.Master]:      "mc.ticket.specialistQualification.master",
    [DefaultQualification.TopMaster]:   "mc.ticket.specialistQualification.topMaster",
    [DefaultQualification.BrandMaster]: "mc.ticket.specialistQualification.brandMaster",
}
