import { BarberQualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"

export const BarberQualificationTranslate: Record<BarberQualification, string> = {
    [BarberQualification.BarberPlus]:      "mc.ticket.barberQualification.barberPlus",
    [BarberQualification.TobBarber]:       "mc.ticket.barberQualification.tobBarber",
    [BarberQualification.TobBarberPlus]:   "mc.ticket.barberQualification.tobBarberPlus",
    [BarberQualification.BrandBarber]:     "mc.ticket.barberQualification.brandBarber",
    [BarberQualification.BrandBarberPlus]: "mc.ticket.barberQualification.brandBarberPlus",
    [BarberQualification.BrandBarberPro]:  "mc.ticket.barberQualification.brandBarberPro",
    [BarberQualification.Expert]:          "mc.ticket.barberQualification.expert",
}
