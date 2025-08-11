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
    if (phone.length === 1) return phone;

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
        phone = phone.substring(1);
    }

    const mobileCode = phone.substring(0, 3);
    const restOfPhone = phone.substring(3);

    return (options.plus ? "+" : "") + "7" + " (" + mobileCode + ") " + phoneBlocks(restOfPhone);
}

export function formatPhone(phone: string | number, options: FormatPhoneOptions = {}): string {
    phone = preparePhone(phone)
    if (phone.length <= 7) return phoneBlocks(phone)
    return formatRussianMobilePhone(phone, options)
}
