import { SodaQualification } from "@v/profile/tickets/create/specialist/_soda/definitions/specialist"

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
