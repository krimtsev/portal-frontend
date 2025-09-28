import type {
    FranchiseeItemRaw,
    FranchiseeItem,
    FranchiseeTelnums
} from "@v/portal/contacts/franchisee/definitions/franchisee"

export function normalizeData(data: FranchiseeItemRaw[]): FranchiseeItem[] {
    const grouped = data.reduce((acc, item) => {
        const telnums: FranchiseeTelnums[] = item.telnums ? JSON.parse(item.telnums) : []

        if (!acc[item.name]) {
            acc[item.name] = {
                filial: item.name,
                names: [],
                telnums: [],
                id: item.id
            };
        }

        telnums.forEach(telnum => {
            if (telnum.name) acc[item.name].names.push(telnum.name)
            if (telnum.number) acc[item.name].telnums.push(telnum.number)
        });

        return acc
    }, {} as Record<string, FranchiseeItem>)

    return Object.values(grouped)
}
