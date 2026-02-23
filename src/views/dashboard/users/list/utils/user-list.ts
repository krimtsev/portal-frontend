import { UsersStates } from "@v/dashboard/users/list/definitions/users-list"
import { Roles } from "@/shared/roles/roles"
import i18n from "@/plugins/i18n"

export const statesList: { id: UsersStates, name: string }[] = [
    {
        id: UsersStates.Active,
        name: i18n.global.t("mc.dashboard.users.state.active"),
    },
    {
        id: UsersStates.Disabled,
        name: i18n.global.t("mc.dashboard.users.state.disabled"),
    },
]

export const rolesList: { id: Roles, name: string }[] = [
    {
        id: Roles.USER,
        name: i18n.global.t("mc.roles.user"),
    },
    {
        id: Roles.ADMIN,
        name: i18n.global.t("mc.roles.admin"),
    },
    {
        id: Roles.SYSADMIN,
        name: i18n.global.t("mc.roles.sysadmin"),
    },
]
