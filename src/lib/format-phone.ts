type FormatPhoneOptions = {
    plus?: boolean;
}

function preparePhone(phone?: string | number) {
    if (!phone) return ""

    if (typeof phone == "number") phone = phone.toString()

    // Очистка от лишнего мусора
    const ALL_CHARACTERS_EXCEPT_NUMBERS_REG_EXP = /[^0-9]+/g
    phone = phone.replace(ALL_CHARACTERS_EXCEPT_NUMBERS_REG_EXP, "")

    // Убираем "000" в начале номера, если четвертый символ != 0
    // Необходимо для обрезания "000" для некоторых звонков у Энфорты
    // Пример кода взят из gw_enforta.js: called = "000" + called.substr(1);
    if (/^0{3}[^0]/.test(phone)) {
        phone = phone.substring(3)
    }

    return phone
}

function phoneBlocks(phone: string): string {
    if (!phone) return ""
    if (phone.length === 1) return phone

    let oddPrefix: string
    let evenPart: string

    if (phone.length % 2) {
        oddPrefix = phone[0] + (phone.length === 5 ? "-" : "")
        evenPart = phone.substring(1)
    } else {
        oddPrefix = ""
        evenPart = phone
    }

    const parts = evenPart.match(/.{1,2}/g) ?? []
    return oddPrefix + parts.join("-")
}

function formatRussianMobilePhone(phone: string, options: FormatPhoneOptions): string {
    if (phone.startsWith("7")) {
        phone = phone.substring(1)
    }

    const mobileCode = phone.substring(0, 3)
    const restOfPhone = phone.substring(3)

    return (options.plus ? "+" : "") + "7" + " (" + mobileCode + ") " + phoneBlocks(restOfPhone)
}

function format8800(telnum: string, plus?: boolean) {
    if (telnum.length !== 11) return telnum

    const nbsp = " " // неразрывный пробел
    const prefix = plus ? `+7${nbsp}` : `8${nbsp}`

    return (
        prefix +
        telnum.slice(1, 4) + nbsp +
        telnum.slice(4, 7) + "-" +
        telnum.slice(7, 9) + "-" +
        telnum.slice(9)
    )
}

export function formatPhone(phone: string | number, options: FormatPhoneOptions = {}): string {
    phone = preparePhone(phone)
    if (phone.length <= 7) return phoneBlocks(phone)
    return formatRussianMobilePhone(phone, options)
}

/**
 * Форматировать любой номер (8800 или любой другой)
 */
export function formatTelnum(phone: string, options: FormatPhoneOptions): string {
    // Убираем все нецифровые символы
    const telnum = phone.replace(/\D/g, "")

    // Если номер формата "7800" или "7804"
    if (
        telnum.startsWith("7800") || telnum.startsWith("8800") ||
        telnum.startsWith("7804") || telnum.startsWith("8804")
    ) {
        return format8800(telnum)
    }

    return formatPhone(telnum, options)
}
