import { LapkiQualification } from "@v/profile/tickets/create/specialist/_lapki/definitions/specialist"

export const GroomerQualificationTranslate: Record<LapkiQualification, string> = {
    [LapkiQualification.Groomer]:      "mc.ticket.specialistQualification.groomer",
    [LapkiQualification.TopGroomer]:   "mc.ticket.specialistQualification.topGroomer",
    [LapkiQualification.BrandGroomer]: "mc.ticket.specialistQualification.brandGroomer",
}
