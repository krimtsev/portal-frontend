import { DateTime } from "luxon"
import ExcelJS from "exceljs"
import { downloadExternalFile } from "@/lib/files"
import type { BankDetailExportResponse } from "@v/dashboard/bank-details/list/definitions/bank-details"

export async function exportXLS(data: BankDetailExportResponse) {
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
        { header: "ФИО предпринимателя", key: "entrepreneur_name", width: 25 },
        { header: "ИНН", key: "inn", width: 30 },
        { header: "Расчётный счёт", key: "checking_account", width: 18 },
        { header: "Наименование банка", key: "bank_name", width: 35 },
        { header: "БИК", key: "bik", width: 15 },
        { header: "Корреспондентский счёт", key: "correspondent_account", width: 30 },
        { header: "Пользователь", key: "user", width: 22 },
        { header: "Филиал", key: "partner", width: 22 },
        { header: "Дата создания", key: "created_at", width: 22 },
        { header: "Дата обновления", key: "updated_at", width: 22 },
    ]

    data.list.forEach((row) => {
        worksheet.addRow({
            entrepreneur_name:     row.entrepreneur_name,
            inn:                   row.inn,
            checking_account:      row.checking_account,
            bank_name:             row.bank_name,
            bik:                   row.bik,
            correspondent_account: row.correspondent_account,
            user:                  row.user,
            partner:               row.partner,
            created_at:            row.created_at,
            updated_at:            row.updated_at,
        })
    })

    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    downloadExternalFile(blob, `Банковские реквизиты - ${date}.xlsx`)
}
