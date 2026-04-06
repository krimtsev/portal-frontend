import type { TicketsExportData } from "@v/dashboard/tickets/list/definitions/tickets"
import { DateTime } from "luxon"
import ExcelJS from "exceljs"
import { downloadExternalFile } from "@/lib/files"
import { stateName } from "@v/profile/tickets/list/utils/ticket"

export async function exportXLS(tickets: TicketsExportData[]) {
    const date = DateTime.now().toFormat("dd.MM.yyyy")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Пользователи" , {
        views: [{ state:  "frozen", xSplit: 1, ySplit: 1 }]
    })

    worksheet.columns = [
        { header: "ID",                key: "id", width: 10 },
        { header: "Тема запроса",      key: "title", width: 35 },
        { header: "Отдел",             key: "category", width: 25 },
        { header: "Статус",            key: "state", width: 15 },
        { header: "Дата подачи",       key: "created_at", width: 30 },
    ]

    tickets.forEach((ticket) => {
        worksheet.addRow({
            id:         ticket.id,
            title:      ticket.title,
            category:   ticket.category,
            state:      stateName(ticket.state),
            created_at: ticket.created_at,
        })
    })

    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })

    downloadExternalFile(blob, `Заявки [500] - ${date}.xlsx`)
}
