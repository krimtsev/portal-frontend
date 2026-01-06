import type { SubscriptionData } from "@v/portal/documents/_britva/subscription/definitions/subscriptions"

export const subscriptionData: SubscriptionData[] = [
    {
        service: "Мужская стрижка",
        barber: "14 900",
        barberPlus: "16 900",
        topBarber: "19 900",
        topBarberPlus: "21 900",
        brandBarber: "24 900",
        brandBarberPlus: "26 900",
        brandBarberPro: "28 900",
    },
    {
        service: "Моделирование бороды",
        barber: "13 900",
        barberPlus: "14 900",
        topBarber: "15 900",
        topBarberPlus: "19 900",
        brandBarber: "24 900",
        brandBarberPlus: "26 900",
        brandBarberPro: "28 900",
    },
    {
        service: "Мужская стрижка + моделирование борода",
        barber: "28 800",
        barberPlus: "31 800",
        topBarber: "35 800",
        topBarberPlus: "41 800",
        brandBarber: "49 800",
        brandBarberPlus: "53 800",
        brandBarberPro: "57 800",
    },
].map((item, index) => ({
    id: index + 1,
    ...item,
}))
