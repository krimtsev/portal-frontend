import { PortalRouteName } from "@r/portal/route-names"
import { ProfileRouteName } from "@r/profile/route-names"
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
                    router.push({ name: ProfileRouteName.ProfileTicketDesign })
                }
            },
            {
                label: "Заявка на сертификат",
                command: () => {
                    router.push({ name: ProfileRouteName.ProfileTicketCertificate })
                }
            },
            {
                label: "Заявка на специалиста",
                command: () => {
                    router.push({ name: ProfileRouteName.ProfileTicketSpecialist })
                }
            },
            {
                label: "Заявка черный список",
                command: () => {
                    router.push({ name: ProfileRouteName.ProfileTicketBlacklist })
                }
            },
            {
                label: "Общая заявка",
                command: () => {
                    router.push({ name: ProfileRouteName.ProfileTicketGeneral })
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
]}
