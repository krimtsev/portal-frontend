import { SodaQualification } from "@v/profile/tickets/create/specialist/_soda/definitions/specialist"
import { DepartmentType } from "@/definitions/departments"

export const SodaQualificationTranslate: Record<SodaQualification, string> = {
    [SodaQualification.TopMasterNailService]:     "mc.ticket.specialistQualification.topMasterNailService",
    [SodaQualification.BrandMasterNailService]:   "mc.ticket.specialistQualification.brandMasterNailService",
    [SodaQualification.TopStylist]:               "mc.ticket.specialistQualification.topStylist",
    [SodaQualification.ArtStylist]:               "mc.ticket.specialistQualification.artStylist",
    [SodaQualification.TopBrowAndMakeupArtist]:   "mc.ticket.specialistQualification.topBrowAndMakeupArtist",
    [SodaQualification.BrandBrowAndMakeupArtist]: "mc.ticket.specialistQualification.brandBrowAndMakeupArtist",
    [SodaQualification.TopMassageTherapist]:      "mc.ticket.specialistQualification.topMassageTherapist",
    [SodaQualification.BrandMassageTherapist]:    "mc.ticket.specialistQualification.brandMassageTherapist",
}

export const SODA_QUALIFICATION_DEPARTMENT_MAP: Record<SodaQualification, DepartmentType> = {
    [SodaQualification.TopMasterNailService]:     DepartmentType.NetworkNail,
    [SodaQualification.BrandMasterNailService]:   DepartmentType.NetworkNail,
    [SodaQualification.TopStylist]:               DepartmentType.Stylist,
    [SodaQualification.ArtStylist]:               DepartmentType.Stylist,
    [SodaQualification.TopBrowAndMakeupArtist]:   DepartmentType.MakeupArtist,
    [SodaQualification.BrandBrowAndMakeupArtist]: DepartmentType.MakeupArtist,
    [SodaQualification.TopMassageTherapist]:      DepartmentType.MassageTherapist,
    [SodaQualification.BrandMassageTherapist]:    DepartmentType.MassageTherapist,
}
