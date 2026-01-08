const stateMap: Record<string, string> = {
    new: "Новый",
    in_progress: "В работе",
    waiting: "Ожидание",
    success: "Решено",
    closed: "Закрыто",
    cancel: "Откланено",
}

export function stateName(state: string): string {
    return stateMap[state] ?? state
}

export function stateList(): { label: string; value: string }[] {
    return Object.entries(stateMap)
        .map(([value, label]) => ({
            label,
            value,
        }))
}
