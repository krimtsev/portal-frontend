import type { Partner } from "@/definitions/partner"

export enum DepartmentType {
    Franchise = "franchise",
    Build = "build",
    Marketing = "marketing",
    NetworkAdmin = "network_admin",
    NetworkBarbering = "network_barbering",
    Community = "community",
    OfficeManager = "office_manager",
    ItDepartment = "it_department",
    Accounting = "accounting",
    NetworkNail = "network_nail",
    MakeupArtist = "makeup_artist",
    Stylist = "stylist",
}

export interface DepartmentItem {
    id:       number
    type:     DepartmentType
    title:    string
    allowed?: Partner[]
}
