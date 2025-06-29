import { createI18n, type I18nOptions } from "vue-i18n"
import ruRU from "@a/locales/ru-RU.json"

const options: I18nOptions = {
    legacy: false,
    locale: "ru-RU",
    fallbackLocale: "ru-RU",
    messages: {
        "ru-RU": ruRU
    },
    datetimeFormats: {
        "ru-RU": {
            shortWeek:                  { weekday: "short" },
            day:                        { day: "numeric" },
            year:                       { year: "numeric" },
            shortMonth:                 { month: "short" },
            month:                      { month: "long" },
            dayMonth:                   { day: "numeric", month: "long" },
            dayShortMonth:              { day: "numeric", month: "short" },
            dayMonthYear:               { day: "numeric", month: "long", year: "numeric" },
            dayShortMonthYear:          { day: "numeric", month: "short", year: "numeric" },
            dayMonthYearPointDelimiter: { day: "2-digit", month: "2-digit", year: "numeric" },
            monthYear:                  { month: "long", year: "numeric" },
            shortWeekDayMonth:          { weekday: "short", day: "numeric", month: "long" },
            weekDayMonth:               { weekday: "long", day: "numeric", month: "long" },
            weekDayMonthYear:           { weekday: "long", day: "numeric", month: "long", year: "numeric" },
            hourMinute:                 { hour: "numeric", minute: "numeric" },
        },
    },
    numberFormats: {
        "ru-RU": {
            currency: {
                style:                 "currency",
                currency:              "RUB",
                currencyDisplay:       "symbol",
                minimumFractionDigits: 0,
            },
            currencyWithDecimals: {
                style:                 "currency",
                currency:              "RUB",
                currencyDisplay:       "symbol",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        },
    },
    pluralizationRules: {
        "ru-RU": function (choice, choicesLength) {
            if (choicesLength === 2) {
                if (choice === 0) return 1

                return choice > 1 ? 1 : 0
            }

            if (choice === 0) {
                return 0
            }

            const teen = choice % 100 > 10 && choice % 100 < 20
            const endsWithOne = choice % 10 === 1

            if (choicesLength < 4) {
                return (!teen && endsWithOne) ? 1 : 2
            }
            if (!teen && endsWithOne) {
                return 1
            }
            if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
                return 2
            }

            return choicesLength < 4 ? 2 : 3
        },
    },
}

const i18n = createI18n<false, typeof options>(options)

export default i18n

