import ExcelJS from "exceljs"
import { DateTime } from "luxon"
import { downloadExternalFile } from "@/lib/files"
import { type UsersExportData } from "@v/dashboard/users/list/definitions/users"
import i18n from "@/plugins/i18n"
import { Roles } from "@/shared/roles/roles"
import { UserAccessType } from "@v/dashboard/users/edit/definitions/user"
import { DepartmentType } from "@/shared/department/department"

export const stateList: { id: boolean, name: string }[] = [
    {
        id:   false,
        name: i18n.global.t("mc.dashboard.users.state.active"),
    },
    {
        id:   true,
        name: i18n.global.t("mc.dashboard.users.state.disabled"),
    },
]

export const rolesList: { id: Roles, name: string }[] = [
    {
        id:   Roles.USER,
        name: i18n.global.t("mc.roles.user"),
    },
    {
        id:   Roles.ADMIN,
        name: i18n.global.t("mc.roles.admin"),
    },
    {
        id:   Roles.SYSADMIN,
        name: i18n.global.t("mc.roles.sysadmin"),
    },
]

export const accessList: { id: UserAccessType, name: string }[] = [
    {
        id:   UserAccessType.LocationMap,
        name: i18n.global.t("mc.dashboard.users.access.locationMap"),
    },
]

export async function exportXLS(users: UsersExportData[]) {
    const date = DateTime.now().toFormat("dd.MM.yyyy")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Пользователи", {
        views: [{
            state:  "frozen",
            xSplit: 1,
            ySplit: 1,
        }],
    })

    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Логин", key: "login", width: 25 },
        { header: "Роль", key: "role", width: 20 },
        { header: "Филиал", key: "partner", width: 30 },
        { header: "Статус", key: "status", width: 15 },
        { header: "Имя", key: "name", width: 30 },
        { header: "Активность", key: "activity", width: 30 },
    ]

    users.forEach((user) => {
        worksheet.addRow({
            id:      user.id,
            login:   user.login,
            role:    i18n.global.t(`mc.roles.${user.role}`),
            partner: user.partner,
            status:  user.disabled
                ? i18n.global.t("mc.dashboard.users.state.disabled")
                : i18n.global.t("mc.dashboard.users.state.active"),
            name:     user.name,
            activity: user.last_activity,
        })
    })

    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    downloadExternalFile(blob, `Пользователи - ${date}.xlsx`)
}

export const departmentNames: Record<DepartmentType, string> = {
    [DepartmentType.FRANCHISE]:         i18n.global.t("mc.department.franchise"),
    [DepartmentType.BUILD]:             i18n.global.t("mc.department.build"),
    [DepartmentType.MARKETING]:         i18n.global.t("mc.department.marketing"),
    [DepartmentType.NETWORK_ADMIN]:     i18n.global.t("mc.department.network_admin"),
    [DepartmentType.NETWORK_BARBERING]: i18n.global.t("mc.department.network_barbering"),
    [DepartmentType.COMMUNITY]:         i18n.global.t("mc.department.community"),
    [DepartmentType.OFFICE_MANAGER]:    i18n.global.t("mc.department.office_manager"),
    [DepartmentType.IT_DEPARTMENT]:     i18n.global.t("mc.department.it_department"),
    [DepartmentType.ACCOUNTING]:        i18n.global.t("mc.department.accounting"),
}

export const departmentsList = Object.entries(departmentNames)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name))

export const departmentName = (key?: string | null) => {
    if (!key) return ""
    return departmentNames[key as DepartmentType] || key
}
