import { LapkiQualification } from "@v/profile/tickets/create/specialist/_lapki/definitions/specialist"

export const GroomerQualificationTranslate: Record<LapkiQualification, string> = {
    [LapkiQualification.Groomer]:          "mc.ticket.lapkiQualification.groomer",
    [LapkiQualification.GroomerPlus]:      "mc.ticket.lapkiQualification.groomerPlus",
    [LapkiQualification.TopGroomer]:       "mc.ticket.lapkiQualification.topGroomer",
    [LapkiQualification.TopGroomerPlus]:   "mc.ticket.lapkiQualification.topGroomerPlus",
    [LapkiQualification.BrandGroomer]:     "mc.ticket.lapkiQualification.brandGroomer",
    [LapkiQualification.BrandGroomerPlus]: "mc.ticket.lapkiQualification.brandGroomerPlus",
    [LapkiQualification.GroomerExpert]:    "mc.ticket.lapkiQualification.groomerExpert",
}
