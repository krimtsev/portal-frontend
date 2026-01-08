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
        command: async () => {
            await router.push({ name: PortalRouteName.Cloud })
        }
    },
    {
        label: "Заявки",
        items: [
            {
                label: "Заявка на макет",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketDesign })
                }
            },
            {
                label: "Заявка на мастера",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketSpecialist })
                }
            },
            {
                label: "Заявка на сертификат",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketCertificate })
                }
            },
            {
                label: "Заявка на черный список",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketBlacklist })
                }
            },
            {
                label: "Индивидуальное согласование",
                command: async () => {
                    await router.push({ name: ProfileRouteName.ProfileTicketGeneral })
                }
            },
        ]
    },
    {
        label: "Поиск сертификатов",
        command: async () => {
            await router.push({ name: PortalRouteName.Certificates })
        }
    },
    {
        label: "Контакты",
        items: [
            {
                label: "Сотрудников центрального офиса",
                command: async () => {
                    await router.push({ name: PortalRouteName.ContactCentralOffice })
                }
            },
            {
                label: "Владельцев франшиз",
                command: async () => {
                    await router.push({ name: PortalRouteName.ContactFranchisee })
                }
            },
            {
                label: "Партнеры",
                command: async () => {
                    await router.push({ name: PortalRouteName.ContactPartners })
                }
            }
        ]
    },
]}
