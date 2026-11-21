import { DateTime } from "luxon"
import ExcelJS from "exceljs"
import { downloadExternalFile } from "@/lib/files"
import type { PromotionExportItem } from "@v/dashboard/promotions/list/definitions/promotions"

export async function exportXLS(data: PromotionExportItem[]) {
    const date = DateTime.now().toFormat("dd.MM.yyyy")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Промо-акции", {
        views: [{
            state:  "frozen",
            xSplit: 0,
            ySplit: 1,
        }],
    })

    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Название", key: "title", width: 30 },
        { header: "Описание", key: "description", width: 40 },
        { header: "Статус", key: "status", width: 15 },
        { header: "Действует до", key: "expires_at", width: 20 },
        { header: "Дата создания", key: "created_at", width: 20 },
        { header: "Пользователь", key: "user", width: 25 },
    ]

    data.forEach((row) => {
        worksheet.addRow({
            id:          row.id,
            title:       row.title,
            description: row.description ?? "",
            status:      row.disabled ? "Заблокирована" : "Активна",
            expires_at:  row.expires_at || "",
            created_at:  row.created_at || "",
            user:        row.user ?? "",
        })
    })

    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    downloadExternalFile(blob, `Промо-акции - ${date}.xlsx`)
}
