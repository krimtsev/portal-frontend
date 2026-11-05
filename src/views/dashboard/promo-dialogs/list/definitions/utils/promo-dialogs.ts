import { DateTime } from "luxon"
import ExcelJS from "exceljs"
import { downloadExternalFile } from "@/lib/files.ts"
import type { PromoDialogExportResponse } from "@v/dashboard/promo-dialogs/list/definitions/promo-dialogs"

export async function exportXLS(data: PromoDialogExportResponse) {
    const date = DateTime.now().toFormat("dd.MM.yyyy")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Пользователи", {
        views: [{
            state:  "frozen",
            xSplit: 0,
            ySplit: 1,
        }],
    })

    worksheet.columns = [
        { header: "Логин", key: "login", width: 25 },
        { header: "Имя пользователя", key: "name", width: 30 },
        { header: "Статус", key: "status", width: 18 },
        { header: "Филиал", key: "partner_name", width: 35 },
        { header: "Ознакомлен", key: "is_read_text", width: 15 },
        { header: "Дата ознакомления", key: "read_at", width: 22 },
    ]

    data.list.forEach((row) => {
        worksheet.addRow({
            login:        row.login,
            name:         row.name ?? "",
            status:       row.disabled ? "Заблокирован" : "Активен",
            partner_name: row.partner_name ?? "",
            is_read_text: row.is_read ? "Да" : "Нет",
            read_at:      row.read_at
                ? DateTime.fromISO(row.read_at).toFormat("dd.MM.yyyy HH:mm")
                : "",
        })
    })

    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    downloadExternalFile(blob, `Промо-диалог ${data.dialog.title} - ${date}.xlsx`)
}
