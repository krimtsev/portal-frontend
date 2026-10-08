import type { SubscriptionData } from "@v/portal/documents/_soda/subscription/definitions/subscriptions"

export const subscriptionData: SubscriptionData[] = [
    {
        service:   "Расслабляющий массаж по 60 минут",
        fiveVisit: "18 500",
        tenVisit:  "35 100",
    },
    {
        service:   "Расслабляющий массаж по 90 минут",
        fiveVisit: "26 100",
        tenVisit:  "49 500",
    },
    {
        service:   "Моделирующий массаж по 60 минут",
        fiveVisit: "21 300",
        tenVisit:  "40 500",
    },
    {
        service:   "Моделирующий массаж по 90 минут",
        fiveVisit: "31 800",
        tenVisit:  "60 300",
    },
].map((item, index) => ({
    id: index + 1,
    ...item,
}))