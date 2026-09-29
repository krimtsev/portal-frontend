import { useRouter } from "vue-router"
import { PortalRouteName } from "@r/portal/route-names"
import { ProfileRouteName } from "@r/profile/route-names"
import { Partner } from "@/definitions/partner"
import { useAppStore } from "@s/app/app"
import { computed } from "vue"

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
    const appStore = useAppStore()

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

    const ticketConfig = [
        {
            label: "Заявка на макет",
            name:  ProfileRouteName.ProfileTicketDesign,
        },
        {
            label: "Заявка на мастера",
            name:  ProfileRouteName.ProfileTicketSpecialist,
        },
        {
            label: "Заявка на администратора",
            name:  ProfileRouteName.ProfileTicketAdministrator,
        },
        {
            label: "Заявка на сертификат",
            name:  ProfileRouteName.ProfileTicketCertificate,
        },
        {
            label: "Заявка на черный список",
            name:  ProfileRouteName.ProfileTicketBlacklist,
        },
        {
            label:   "Заявка на FLAGMAN",
            name:    ProfileRouteName.ProfileTicketFlagman,
            visible: () => appStore.isBritva || appStore.isSoda,
        },
        {
            label:   "Заявка на подолога",
            name:    ProfileRouteName.ProfileTicketPodiatrist,
            visible: () => appStore.isSoda,
        },
        {
            label:   "Макияж для себя",
            name:    ProfileRouteName.ProfileTicketMakeup,
            visible: () => appStore.isSoda,
        },
        {
            label: "Индивидуальное согласование",
            name:  ProfileRouteName.ProfileTicketGeneral,
        },
        {
            label: "Скоро открытие",
            name:  ProfileRouteName.ProfileTicketOpening,
        },
    ]

    const ticketsItem = computed<MenuItem>(() => ({
        label: "Заявки",
        items: ticketConfig
            .filter(item => item.visible ? item.visible() : true)
            .map(item => ({
                label:   item.label,
                command: () => router.push({ name: item.name }),
            })),
    }))

    switch (appStore.currentPartner) {
        case Partner.Lapki:
            return [
                cloudItem,
                ticketsItem.value,
                certificatesItem,
                contactsItem,
            ]

        case Partner.Soda:
        case Partner.Britva:
        default:
            return [
                cloudItem,
                ticketsItem.value,
                certificatesItem,
                analyticsItem,
                contactsItem,
            ]
    }
}
