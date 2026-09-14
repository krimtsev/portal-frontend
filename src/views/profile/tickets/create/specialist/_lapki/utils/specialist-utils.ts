import { LapkiQualification } from "@v/profile/tickets/create/specialist/_lapki/definitions/specialist"

export const GroomerQualificationTranslate: Record<LapkiQualification, string> = {
    [LapkiQualification.Groomer]:          "mc.ticket.specialistQualification.groomer",
    [LapkiQualification.GroomerPlus]:      "mc.ticket.specialistQualification.groomerPlus",
    [LapkiQualification.TopGroomer]:       "mc.ticket.specialistQualification.topGroomer",
    [LapkiQualification.TopGroomerPlus]:   "mc.ticket.specialistQualification.topGroomerPlus",
    [LapkiQualification.BrandGroomer]:     "mc.ticket.specialistQualification.brandGroomer",
    [LapkiQualification.BrandGroomerPlus]: "mc.ticket.specialistQualification.brandGroomerPlus",
    [LapkiQualification.GroomerExpert]:    "mc.ticket.specialistQualification.groomerExpert",
}
