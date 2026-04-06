import i18n from "@/plugins/i18n"
import { DateTime } from "luxon"
import ExcelJS from "exceljs"
import { downloadExternalFile } from "@/lib/files"
import type { PartnersExportData } from "@v/dashboard/partners/list/definitions/partners"

export const stateList: { id: boolean, name: string }[] = [
    {
        id:   false,
        name: i18n.global.t("mc.dashboard.partners.state.active"),
    },
    {
        id:   true,
        name: i18n.global.t("mc.dashboard.partners.state.disabled"),
    },
]

export async function exportXLS(partners: PartnersExportData[]) {
    const date = DateTime.now().toFormat("dd.MM.yyyy")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Пользователи" , {
        views: [{ state:  "frozen", xSplit: 1, ySplit: 1 }]
    })

    worksheet.columns = [
        { header: "ID",                key: "id", width: 10 },
        { header: "Имя партнера",      key: "name", width: 25 },
        { header: "Организация",       key: "organization", width: 35 },
        { header: "ИНН",               key: "inn", width: 20 },
        { header: "ОГРНИП",            key: "ogrnip", width: 20 },
        { header: "Номер договора",    key: "contract_number", width: 15 },
        { header: "Адрес организации", key: "address", width: 30 },
        { header: "Статус",            key: "status", width: 15 },
        { header: "Дата подписания",   key: "start_at", width: 30 },
    ]

    partners.forEach((partner) => {
        worksheet.addRow({
            id:              partner.id,
            name:            partner.name,
            organization:    partner.organization,
            inn:             partner.inn,
            ogrnip:          partner.ogrnip,
            contract_number: partner.contract_number,
            address:         partner.address,
            status:  partner.disabled
                ? i18n.global.t("mc.dashboard.partners.state.disabled")
                : i18n.global.t("mc.dashboard.partners.state.active"),
            start_at:        partner.start_at,
        })
    })

    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })

    downloadExternalFile(blob, `Филиалы - ${date}.xlsx`)
}
