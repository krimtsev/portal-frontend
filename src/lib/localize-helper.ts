import type { Roles } from "@/shared/roles/roles"
import i18n from "@/plugins/i18n"

export function getRoleName(role?: Roles) {
    if (!role) return ""
    const userRole = `mc.roles.${role}`
    return i18n.global.te(userRole) ? i18n.global.t(userRole) : "—"
}
