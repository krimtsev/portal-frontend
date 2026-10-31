interface PartnersData {
    name:    string
    manager: string
    phone:   string
    details: {
        label: string
        value: string
    }[]
    site?: {
        label: string
        href:  string
    }
}

export const partnersData: PartnersData[] = [
    {
        name:    "Luvu",
        manager: "Юлия Киреева",
        phone:   "79019000088",
        details: [
            {
                label: "Минимальный заказ",
                value: "30 000 ₽",
            },
            {
                label: "Размер скидки",
                value: "от 15% до 25% в зависимости от объема покупки (15% от 30 000 ₽)",
            },
            {
                label: "Стоимость доставки",
                value: "платная (в зависимости от расположения)",
            },
        ],
        site: {
            label: "luvucosmetics.ru",
            href:  "https://luvucosmetics.ru",
        },
    },
    {
        name:    "Pusy/luv",
        manager: "Алёна",
        phone:   "79296416239",
        details: [
            {
                label: "Минимальный заказ",
                value: "30 000 ₽",
            },
            {
                label: "Размер скидки",
                value: [
                    "25% от 30 000 ₽",
                    "30% от 50 000 ₽",
                    "40% от 100 000 ₽",
                    "45% от 200 000 ₽",
                    "50% от 300 000 ₽",
                ].join("\n"),
            },
            {
                label: "Стоимость доставки",
                value: "платная (в зависимости от расположения)",
            },
        ],
        site: {
            label: "pusybeauty.com",
            href:  "https://pusybeauty.com",
        },
    },
    {
        name:    "Bronsun",
        manager: "Анна",
        phone:   "79160222889",
        details: [
            {
                label: "Размер скидки",
                value: "25% при регистрации на сайте",
            },
            {
                label: "Условия получения",
                value: [
                    "- Регистрируемся с рабочей/личной почты",
                    "- Отправляем почту Анне",
                    "- Ждем пока закрепят скидку 25% к вашему browmart.ru",
                ].join("\n"),
            },
        ],
    },
    {
        name:    "BrowHenna",
        manager: "Мария",
        phone:   "79160513843",
        details: [
            {
                label: "Размер скидки",
                value: "30%",
            },
            {
                label: "Минимальный заказ",
                value: "от любой суммы",
            },
            {
                label: "Стоимость доставки",
                value: "по тарифу транспортной компании, зависит от локации и города",
            },
        ],
    },
]
