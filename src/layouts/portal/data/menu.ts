import { PortalRouteName } from "@r/portal/route-names"
import { openExternalLink } from "@/lib/link"
import { useRouter } from "vue-router"

type MenuCommand = () => void

interface MenuItem {
    label: string
    command: MenuCommand
    icon?: string
    class?: string
}

export function menuData(): MenuItem[] {
    const router = useRouter()

    return [
    {
        label: "Информация",
        command: () => {
            console.log("Перейти на главную")
        }
    },
    {
        label: "Заявки",
        command: () => {
            console.log("Перейти в заявки")
        }
    },
    {
        label: "Поиск сертификатов",
        command: () => {
            router.push({ name: PortalRouteName.Certificates })
        }
    },
    {
        label: "Доп. услуги",
        command: () => {
            console.log("Перейти в настройки")
        }
    },
    {
        label: "Контакты",
        command: () => {
            router.push({ name: PortalRouteName.ContactCentralOffice })
        }
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
