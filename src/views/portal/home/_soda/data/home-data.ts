import { portalPaths } from "@r/portal/path"
import type { Section } from "@c/portal/portal-information-menu/definitions/portal-information-menu"
import { computed } from "vue"
import { useAppStore } from "@s/app/app"

export const sections = computed((): Section[] => {
    const appStore = useAppStore()

    const list: Section[] = [
        {
            title: "Инструкции",
            items: [
                {
                    label: "Как сделать переадресацию звонков?",
                    path:  portalPaths.InstructionMangoRedirect,
                },
                {
                    label: "Как включить всплывающие уведомления?",
                    path:  portalPaths.InstructionYclientNotifications,
                },
                {
                    label: "Что делать, если телефония не работает?",
                    path:  portalPaths.IpTelephonyTroubleshooting,
                },
            ],
        },
        {
            title: "Обучение",
            items: [
                {
                    label:    "Перейти на портал обучения",
                    external: "https://learn.mybritva.ru",
                },
                {
                    label:    "Курс для администраторов",
                    external: "https://start.bizon365.ru/kassa/britva/checkout/B9g3-lbT5fe?rnd=MTc5MDkzNTA0MzcwOXwyMTMuMTM1LjkwLjIyNg==",
                },
                {
                    label:    "Курс для Мастера ногтевого сервиса",
                    external: "https://start.bizon365.ru/kassa/britva/checkout/SqWPfe-Tczx?rnd=MTc5MDkzNTA1NDk0MnwyMTMuMTM1LjkwLjIyNg==",
                },
                {
                    label:    "Курс для стилистов",
                    external: "https://start.bizon365.ru/kassa/britva/checkout/B9eMUxZ69Ge?rnd=MTc5MDkzNTExMzgxMnwyMTMuMTM1LjkwLjIyNg==",
                },
            ],
        },
        {
            title: "Отчеты",
            items: [
                {
                    label:    "Таблица оплаты телефонии",
                    external: "https://docs.google.com/spreadsheets/d/1EllHBxOGbK61fOl7rMqenM7oCF59e3_30F_JA3xTAw8",
                },
            ],
        },
        {
            title: "Документация",
            items: [
                {
                    label: "Система работы абонементов",
                    path:  portalPaths.DocumentSubscription,
                },
                {
                    label: "Система работы сертификатов",
                    path:  portalPaths.DocumentCertificate,
                },
                {
                    label: "Штрафы",
                    path:  portalPaths.DocumentFines,
                },
                {
                    label: "Штрафы по аудиту",
                    path:  portalPaths.DocumentFinesAudit,
                },
            ],
        },
        {
            title: "Дополнительные услуги",
            items: [
                {
                    label: "Подписка Яндекс.Карты и 2ГИС",
                    path:  portalPaths.ServiceSubscription,
                },
                {
                    label: "Сервис пропущенных звонков",
                    path:  portalPaths.ServiceMissedCalls,
                },
            ],
        },
        {
            title: "Контакты",
            items: [
                {
                    label: "Сотрудники центрального офиса",
                    path:  portalPaths.ContactCentralOffice,
                },
                {
                    label: "Владельцы франшиз",
                    path:  portalPaths.ContactFranchisee,
                },
                {
                    label: "Партнеры",
                    path:  portalPaths.ContactPartners,
                },
            ],
        },
        {
            title: "Обязательные интеграции",
            items: [
                {
                    label: "Система видеoаналитики IVIDEON",
                    path:  portalPaths.IntegrationVideoAnalytics,
                },
                {
                    label: "Контроль качества телефонии DIALOGIC AI",
                    path:  portalPaths.IntegrationTelephonyQuality,
                },
            ],
        },
    ]

    const additionally = {
        title: "Дополнительно",
        items: [
            {
                label: "Корпоративные скидки",
                path:  portalPaths.AdditionallyDiscount,
            },
        ],
    }

    if (appStore.showLocationMap) {
        additionally.items.push({
            label: "Карта для стройки",
            path:  portalPaths.LocationMap,
        })
    }

    list.push(additionally)

    return list
})
