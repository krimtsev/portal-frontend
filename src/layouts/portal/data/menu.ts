import { useRouter } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import { ProfileRouteName } from "@r/profile/route-names"
import partnerContext from "virtual:partner"
import { Partner } from "@/definitions/partner"

type MenuCommand = () => void

interface MenuItem {
    label:    string
    command?: MenuCommand
    icon?:    string
    class?:   string
    items?:   MenuItem[]
}

export function menuData(): MenuItem[] {
    const router = useRouter()

    const cloudItem: MenuItem = {
        label:   "Облако файлов",
        command: async () => {
            await router.push({ name: PortalRouteName.Cloud })
        },
    }

    const certificatesItem: MenuItem = {
        label:   "Поиск сертификатов",
        command: async () => {
            await router.push({ name: PortalRouteName.Certificates })
        },
    }

    const analyticsItem: MenuItem = {
        label:   "Аналитика",
        class:   "adt",
        command: async () => {
            await router.push({ name: ProfileRouteName.ProfileStatisticsStaff })
        },
    }

    const contactsItem: MenuItem = {
        label: "Контакты",
        items: [
            {
                label:   "Сотрудники центрального офиса",
                command: async () => {
                    await router.push({ name: PortalRouteName.ContactCentralOffice })
                },
            },
            {
                label:   "Владельцы франшиз",
                command: async () => {
                    await router.push({ name: PortalRouteName.ContactFranchisee })
                },
            },
            {
                label:   "Партнеры",
                command: async () => {
                    await router.push({ name: PortalRouteName.ContactPartners })
                },
            },
        ],
    }

    const ticketsBritva: MenuItem = {
        label: "Заявки",
        items: [
            {
                label:   "Заявка на макет",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketDesign })
                },
            },
            {
                label:   "Заявка на мастера",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketSpecialist })
                },
            },
            {
                label:   "Заявка на администратора",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketAdministrator })
                },
            },
            {
                label:   "Заявка на сертификат",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketCertificate })
                },
            },
            {
                label:   "Заявка на черный список",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketBlacklist })
                },
            },
            {
                label:   "Заявка на FLAGMAN",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketFlagman })
                },
            },
            {
                label:   "Индивидуальное согласование",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketGeneral })
                },
            },
            {
                label:   "Скоро открытие",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketOpening })
                },
            },
        ],
    }

    const currentPartner = partnerContext.name as Partner

    switch (currentPartner) {
        case Partner.Lapki:
            return [
                cloudItem,
                certificatesItem,
                contactsItem,
            ]

        case Partner.Soda:
            return [
                cloudItem,
                certificatesItem,
                analyticsItem,
                contactsItem,
            ]

        case Partner.Britva:
        default:
            return [
                cloudItem,
                ticketsBritva,
                certificatesItem,
                analyticsItem,
                contactsItem,
            ]
    }
}
