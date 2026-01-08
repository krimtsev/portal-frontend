import type { Section } from "@c/portal/portal-information-menu/definitions/portal-information-menu"
import { portalPaths } from "@r/portal/path"

export const sections: Section[] = [
    {
        title: "Инструкции",
        items: [
            {
                label: "Настройка переадресации MANGO",
                path: portalPaths.InstructionMangoRedirect
            },
            {
                label: "Всплывающие уведомления YCLIENTS",
                path: portalPaths.InstructionYclientNotifications
            },
            {
                label: "Настройка WAHELP",
                external: "https://youtube.com/playlist?list=PLhU6BmCA9pdCwapNa44e3BWdPe0EnvJJ2"
            },
            {
                label: "Настройка изменения цен ЭВОТОР",
                external: "https://youtu.be/6cy9sEyNDXU?si=3x0R0pmKIRHM08YO"
            }
        ]
    },
    {
        title: "Обучение",
        items: [
            {
                label: "Перейти на портал обучения",
                external: "https://learn.mybritva.ru"
            },
            {
                label: "Курсы для сотрудников",
                external: "https://britva-education.ru"
            }
        ]
    },
    {
        title: "Отчеты",
        items: [
            {
                label: "Таблица оплаты телефонии",
                external: "https://docs.google.com/spreadsheets/d/1Y9zxXV-NZZvFHJNnESGBDiipCMNM1jjqQEzHqj8KRg0"
            },
            {
                label: "Таблица маркет. сбора",
                external: "https://docs.google.com/spreadsheets/d/1ka8_eTE18gQNr-LCCiKYKd_u0rG6dJ5R7oGFTQg6pdM"
            }
        ]
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
            {
                label: "Бальная система по манго-аудиту",
                path:  portalPaths.DocumentMangoAudit,
            }
        ]
    },
    {
        title: "Дополнительные услуги",
        items: [
            {
                label: "Платные услуги ЦО",
                path:  portalPaths.ServicePaidCO,
            },
            {
                label: "Подписка Яндекс.Карты и 2ГИС",
                path:  portalPaths.ServiceSubscription,
            },
            {
                label: "Сервис пропущенных звонков",
                path:  portalPaths.ServiceMissedCalls,
            },
            // {
            //     label: "Сервис аналитики показателей",
            //     path:  portalPaths.ServiceUserAnalytics,
            // }
        ]
    },
    {
        title: "Контакты",
        items: [
            {
                label: "Сотрудников центрального офиса",
                path:  portalPaths.ContactCentralOffice,
            },
            {
                label: "Франчайзи",
                path:  portalPaths.ContactFranchisee,
            },
            {
                label: "Партнеров",
                path:  portalPaths.ContactPartners,
            },
        ]
    },
    {
        title: "Дополнительно",
        items: [
            {
                label: "KPI франшизы (регионы)",
                external: "https://docs.google.com/forms/d/e/1FAIpQLSeqcM5AKcoTWECLfA_kDPZEHGpUQv_iFIx1uCVtros447ubHQ/viewform"
            },
            {
                label: "Корпоративные скидки",
                path: portalPaths.AdditionallyDiscount,
            }
        ]
    },
]
