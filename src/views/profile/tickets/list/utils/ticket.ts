const stateMap: Record<string, string> = {
    new:         "Новый",
    in_progress: "В работе",
    waiting:     "Ожидание",
    success:     "Решено",
    closed:      "Закрыто",
    cancel:      "Отклонено",
}

export function stateName(state: string): string {
    return stateMap[state] ?? state
}

export function stateList(): { id: string, title: string }[] {
    return Object.entries(stateMap)
        .map(([id, title]) => ({
            title,
            id,
        }))
}
