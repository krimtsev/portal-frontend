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
            title: "Документация",
            items: [
                {
                    label: "Система работы сертификатов",
                    path:  portalPaths.DocumentCertificate,
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
