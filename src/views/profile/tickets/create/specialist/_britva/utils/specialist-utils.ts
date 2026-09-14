import { BarberQualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"

export const BarberQualificationTranslate: Record<BarberQualification, string> = {
    [BarberQualification.BarberPlus]:      "mc.ticket.specialistQualification.barberPlus",
    [BarberQualification.TobBarber]:       "mc.ticket.specialistQualification.tobBarber",
    [BarberQualification.TobBarberPlus]:   "mc.ticket.specialistQualification.tobBarberPlus",
    [BarberQualification.BrandBarber]:     "mc.ticket.specialistQualification.brandBarber",
    [BarberQualification.BrandBarberPlus]: "mc.ticket.specialistQualification.brandBarberPlus",
    [BarberQualification.BrandBarberPro]:  "mc.ticket.specialistQualification.brandBarberPro",
    [BarberQualification.Expert]:          "mc.ticket.specialistQualification.expert",
}
