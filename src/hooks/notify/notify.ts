import { useToast } from "primevue/usetoast"
import i18n from "@/plugins/i18n"

export function useNotify() {
    const toast = useToast()

    function error (summary?: string) {
        toast.add({
            severity: "error",
            summary: summary ?? i18n.global.t("mc.notify.error"),
            life: 95000,
            closable: false
        });
    }

    function success (summary?: string) {
        toast.add({
            severity: "success",
            summary: summary ?? i18n.global.t("mc.notify.success"),
            life: 5000,
            closable: false
        })
    }

    return {
        error,
        success
    }
}
