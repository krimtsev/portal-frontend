const stateMap: Record<string, string> = {
    new: "Новый",
    in_progress: "В работе",
    waiting: "Ожидание",
    success: "Успешно",
    closed: "Закрыт",
    cancel: "Отменён",
}

export function stateName(state: string): string {
    return stateMap[state] ?? state
}
