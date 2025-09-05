import type { SubscriptionData } from "@v/portal/_britva/documents/subscription/definitions/subscriptions"

export const subscriptionData: SubscriptionData[] = [
    {
        service: "Мужская стрижка",
        barber: "12 900",
        topBarber: "15 900",
        brandBarber: "19 900",
        brandBarberPlus: "21 900",
    },
    {
        service: "Моделирование бороды",
        barber: "10 900",
        topBarber: "11 900",
        brandBarber: "19 900",
        brandBarberPlus: "21 900",
    },
    {
        service: "Стрижка + борода",
        barber: "23 800",
        topBarber: "27 800",
        brandBarber: "39 800",
        brandBarberPlus: "43 800",
    },
].map((item, index) => ({
    id: index + 1,
    ...item,
}))
