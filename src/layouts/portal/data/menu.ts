import { PortalRouteName } from "@r/portal/route-names"
import { openExternalLink } from "@/lib/link"
import { useRouter } from "vue-router"

type MenuCommand = () => void

interface MenuItem {
    label: string
    command?: MenuCommand
    icon?: string
    class?: string
    items?: MenuItem[]
}

export function menuData(): MenuItem[] {
    const router = useRouter()

    return [
    {
        label: "Облако файлов",
        command: () => {
            router.push({ name: PortalRouteName.Cloud })
        }
    },
    {
        label: "Заявки",
        items: [
            {
                label: "Заявка на макет",
                command: () => {
                    router.push({ name: PortalRouteName.TicketDesign })
                }
            },
            {
                label: "Заявка на сертификат",
                command: () => {
                    router.push({ name: PortalRouteName.TicketCertificate })
                }
            },
            {
                label: "Заявка на специалиста",
                command: () => {
                    router.push({ name: PortalRouteName.TicketSpecialist })
                }
            },
            {
                label: "Заявка черный список",
                command: () => {
                    router.push({ name: PortalRouteName.TicketBlacklist })
                }
            },
        ]
    },
    {
        label: "Поиск сертификатов",
        command: () => {
            router.push({ name: PortalRouteName.Certificates })
        }
    },
    {
        label: "Контакты",
        items: [
            {
                label: "Центральный офис",
                command: () => {
                    router.push({ name: PortalRouteName.ContactCentralOffice })
                }
            },
            {
                label: "Франчайзи",
                command: () => {
                    router.push({ name: PortalRouteName.ContactFranchisee })
                }
            },
            {
                label: "Партнеры",
                command: () => {
                    router.push({ name: PortalRouteName.ContactPartners })
                }
            }
        ]
    },
    {
        label: "Админам",
        icon: "pi pi-arrow-up-right",
        class: "right-icon",
        command: () => {
            openExternalLink("https://britva.tech/britva")
        }
    }
]}
