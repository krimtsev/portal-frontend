import type { SubscriptionData } from "@v/portal/documents/_lapki/subscription/definitions/subscriptions"

export const subscriptionData: SubscriptionData[] = [
    {
        service:   "Озоновый SPA-курс",
        fiveVisit: "8 600",
        tenVisit:		"16 200",
    },
    {
        service:   "Гигиена полости рта собаки до 10 кг",
        fiveVisit: "3 300",
        tenVisit:		"6 600",
    },
    {
        service:   "Когтекюр собаки до 10 кг",
        fiveVisit: "2 800",
        tenVisit:		"5 400",
    },
].map((item, index) => ({
    id: index + 1,
    ...item,
}))
