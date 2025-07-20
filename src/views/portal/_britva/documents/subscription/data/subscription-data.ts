
interface SubscriptionData {
    id: number;
    service: string;
    barber: string;
    topBarber: string;
    brandBarber: string;
    brandBarberPlus: string;
}

export const subscriptionData: SubscriptionData[] = [
    {
        id: 1,
        service: "Мужская стрижка",
        barber: "12 900",
        topBarber: "15 900",
        brandBarber: "19 900",
        brandBarberPlus: "21 900",
    },
    {
        id: 2,
        service: "Моделирование бороды",
        barber: "10 900",
        topBarber: "11 900",
        brandBarber: "19 900",
        brandBarberPlus: "21 900",
    },
    {
        id: 3,
        service: "Стрижка + борода",
        barber: "23 800",
        topBarber: "27 800",
        brandBarber: "39 800",
        brandBarberPlus: "43 800",
    },
]
