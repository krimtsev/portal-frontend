import i18n from "@/plugins/i18n"

const stateMap: Record<string, string> = {
    new:         i18n.global.t("mc.common.status.new"),
    in_progress: i18n.global.t("mc.common.status.inProgress"),
    waiting:     i18n.global.t("mc.common.status.waiting"),
    success:     i18n.global.t("mc.common.status.success"),
    closed:      i18n.global.t("mc.common.status.closed"),
    cancel:      i18n.global.t("mc.common.status.cancel"),
}

export function stateName(state: string): string {
    return stateMap[state] ?? state
}

export function ticketStateList(): { id: string, title: string }[] {
    return Object.entries(stateMap)
        .map(([id, title]) => ({
            title,
            id,
        }))
}
