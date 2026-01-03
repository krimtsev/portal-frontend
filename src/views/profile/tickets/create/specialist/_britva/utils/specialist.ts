import { Qualification } from "@v/profile/tickets/create/specialist/_britva/definitions/specialist"

/**
 * Ключи используются для переводов шаблонов.
 */
export const TRANSLATIONS = {
    name: "Имя сотрудника",
    phone: "Телефон сотрудника",
    experience: "Стаж работы",
    statistics: "Статистика",
    message: "Дополнительные комментарии",
    linkToWorks: "Ссылка на работы",
    files: "Добавить файлы"
}

export const TICKET_TITLE = "Заявка на специалиста"

export function qualificationName(value: Qualification): string {
    switch (value) {
        case Qualification.BarberPlus:
            return "Барбер +"
        case Qualification.TobBarber:
            return "Топ-Барбер"
        case Qualification.TobBarberPlus:
            return "Топ-Барбер +"
        case Qualification.BrandBarber:
            return "Бренд-Барбер"
        case Qualification.BrandBarberPlus:
            return "Бренд-Барбер +"
        case Qualification.BrandBarberPro:
            return "Бренд-Барбер ПРО"
        case Qualification.Expert:
            return "Эксперт"
    }

    return value
}
