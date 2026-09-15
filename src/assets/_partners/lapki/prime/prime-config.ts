export default {
    components: {
        breadcrumb: {
            colorScheme: {
                light: {
                    root: {
                        padding:    0,
                        background: "transparent",
                        item:       {
                            color: "{primary.400}",
                            link:  "{primary.500}",
                        },
                        separator: {
                            color: "{primary.300}",
                        },
                        last: {
                            color: "{primary.500}",
                        },
                    },
                },
            },
        },
        menubar: {
            colorScheme: {
                light: {
                    root: {
                        base: {
                            item: {
                                border: {
                                    radius: "2.286rem",
                                },
                                font: {
                                    weight: "600",
                                },
                            },
                        },
                        item: {
                            color:  "{primary.500}",
                            border: {
                                color:  "{primary.500}",
                                radius: "2.286rem",
                            },
                            focus: {
                                background: "{primary.500}",
                                color:      "{surface.0}",
                            },
                            active: {
                                background: "{primary.500}",
                                color:      "{surface.0}",
                            },
                        },
                        submenu: {
                            color:  "{primary.500}",
                            border: {
                                radius: "1.714rem",
                                color:  "{primary.500}",
                            },
                            icon: {
                                color: "{primary.500}",
                                focus: {
                                    color: "{surface.0}",
                                },
                            },
                        },
                    },
                },
            },
        },
        message: {
            text: {
                font: {
                    size: "1rem",
                },
                sm: {
                    font: {
                        size: "0.8571rem",
                    },
                },
                lg: {
                    font: {
                        size: "1.1429rem",
                    },
                },
            },
        },
        inputtext: {
            colorScheme: {
                light: {
                    root: {
                        background:  "{primary.50}",
                        placeholder: {
                            color: "{primary.500}",
                        },
                        border: {
                            color: "transparent",
                        },
                        disabled: {
                            color:           "{primary.500}",
                            backgroundColor: "{surface.0}",
                        },
                    },
                },
            },
        },
        textarea: {
            colorScheme: {
                light: {
                    root: {
                        background:  "{primary.50}",
                        placeholder: {
                            color: "{primary.500}",
                        },
                        border: {
                            color: "transparent",
                        },
                        disabled: {
                            color:           "{primary.500}",
                            backgroundColor: "{surface.0}",
                        },
                        label: {
                            color: "{primary.500}",
                        },
                    },
                },
            },
        },
        select: {
            colorScheme: {
                light: {
                    root: {
                        background:  "{primary.50}",
                        placeholder: {
                            color: "{primary.500}",
                        },
                        border: {
                            color: "transparent",
                        },
                        disabled: {
                            color:           "{primary.500}",
                            backgroundColor: "{surface.0}",
                        },
                        option: {
                            color: "{primary.500}",
                            focus: {
                                color:      "{primary.500}",
                                background: "{primary.100}",
                            },
                        },
                    },
                },
            },
            option: {
                padding: "{select.padding.y} 0.75rem",
            },
        },
        multiselect: {
            colorScheme: {
                light: {
                    root: {
                        background:  "{primary.50}",
                        placeholder: {
                            color: "{primary.500}",
                        },
                        border: {
                            color: "transparent",
                        },
                        disabled: {
                            color:           "{primary.500}",
                            backgroundColor: "{surface.0}",
                        },
                        option: {
                            color: "{primary.500}",
                            focus: {
                                color:      "{primary.500}",
                                background: "{primary.100}",
                            },
                            group: {
                                color: "{primary.500}",
                            },
                        },
                    },
                },
            },
            option: {
                padding: "{multiselect.padding.y} 0.75rem",
            },
        },
        datepicker: {
            colorScheme: {
                light: {
                    root: {
                        date: {
                            color: "{primary.500}",
                            hover: {
                                color:      "{primary.500}",
                                background: "{primary.50}",
                            },
                        },
                        select: {
                            year: {
                                color: "{primary.500}",
                                hover: {
                                    color:      "{primary.500}",
                                    background: "{primary.50}",
                                },
                            },
                        },
                    },
                },
            },
        },
        floatlabel: {
            colorScheme: {
                light: {
                    root: {
                        color: "{primary.500}",
                    },
                },
            },
        },
        togglebutton: {
            colorScheme: {
                light: {
                    root: {
                        background: "{primary.50}",
                        color:      "{primary.400}",
                        hover:      {
                            color:      "{primary.500}",
                            background: "{primary.50}",
                        },
                        border: {
                            color: "{primary.50}",
                        },
                        checked: {
                            color:      "{primary.0}",
                            background: "{primary.50}",
                            border:     {
                                color: "{primary.50}",
                            },
                        },
                        content: {
                            checked: {
                                background: "{primary.500}",
                            },
                        },
                    },
                },
            },
        },
        datatable: {
            colorScheme: {
                light: {
                    header: {
                        color:      "{primary.400}",
                        background: "transparent",
                        cell:       {
                            color:  "{primary.400}",
                            border: {
                                color: "{primary.200}",
                            },
                        },
                    },
                    body: {
                        cell: {
                            border: {
                                color: "{primary.200}",
                            },
                            padding: "0.9rem 1rem",
                        },
                    },
                    row: {
                        color:      "{primary.400}",
                        background: "transparent",
                        hover:      {
                            color:      "{primary.300}",
                            background: "{primary.100}",
                        },
                    },
                    footer: {
                        color: "{surface.0}",
                        cell:  {
                            color:      "{primary.400}",
                            background: "transparent",
                            border:     {
                                color: "{content.border.color}",
                            },
                        },
                    },
                },
            },
        },
        treetable: {
            colorScheme: {
                light: {
                    header: {
                        cell: {
                            color:  "{primary.400}",
                            border: {
                                color: "{primary.200}",
                            },
                        },
                    },
                    body: {
                        cell: {
                            border: {
                                color: "{primary.200}",
                            },
                        },
                    },
                    row: {
                        color:      "{primary.400}",
                        background: "transparent",
                        hover:      {
                            color:      "{primary.300}",
                            background: "{primary.100}",
                        },
                    },
                    node: {
                        toggle: {
                            button: {
                                color: "{primary.400}",
                            },
                        },
                    },
                },
            },
        },
        paginator: {
            colorScheme: {
                light: {
                    color: "{primary.400}",
                    nav:   {
                        button: {
                            color:    "{primary.400}",
                            selected: {
                                color:      "{primary.600}",
                                background: "{primary.50}",
                            },
                            hover: {
                                color:      "{primary.300}",
                                background: "transparent",
                                border:     {
                                    color: "{primary.300}",
                                },
                            },
                        },
                    },
                },
            },
        },
        toast: {
            colorScheme: {
                light: {
                    error: {
                        color:      "{red.50}",
                        background: "{red.500}",
                    },
                },
            },
        },
        skeleton: {
            colorScheme: {
                light: {
                    root: {
                        background: "rgba(116, 159, 195, 0.2)",
                        animation:  {
                            background: "rgba(116, 159, 195, 0.4)",
                        },
                    },
                },
            },
        },
        tag: {
            root: {
                fontWeight: 600,
            },
            colorScheme: {
                light: {
                    disabled: {
                        background: "{surface.200}",
                        color:      "{surface.500}",
                    },
                    active: {
                        background: "{violet.100}",
                        color:      "{violet.600}",
                    },
                },
            },
        },
        avatar: {
            root: {
                width:    "2.643rem",
                height:   "2.643rem",
                fontSize: "1.3rem",
            },
            colorScheme: {
                light: {
                    root: {
                        color:      "{surface.0}",
                        background: "{primary.500}",
                    },
                },
            },
        },
        tooltip: {
            root: {
                maxWidth: "20rem",
            },
            colorScheme: {
                light: {
                    root: {
                        background: "{surface.700}",
                        color:      "{surface.0}",
                    },
                },
            },
        },
        dialog: {
            title: {
                fontSize: "1.2857rem",
            },
            header: {
                padding: "2rem",
            },
            content: {
                padding: "0 2rem 2rem 2rem",
            },
            footer: {
                padding: "0 2rem 2rem 2rem",
            },
            colorScheme: {
                light: {
                    root: {
                        border: {
                            color: "{surface.600}",
                        },
                    },
                },
            },
        },
        fileupload: {
            header: {
                padding: "0 0 0.5714rem 0",
            },
        },
        progressspinner: {
            colorScheme: {
                light: {
                    root: {
                        colorOne:   "{primary.200}",
                        colorTwo:   "{primary.400}",
                        colorThree: "{primary.600}",
                        colorFour:  "{primary.800}",
                    },
                },
            },
        },
        tabs: {
            colorScheme: {
                light: {
                    root: {
                        tab: {
                            padding: "1.1429rem 1.1429rem",
                            color:   "{primary.400}",
                            hover:   {
                                color: "{primary.500}",
                            },
                        },
                    },
                },
            },
        },
        checkbox: {
            colorScheme: {
                light: {
                    label: {
                        color: "{primary.500}",
                    },
                    background: "{primary.100}",
                },
            },
        },
        button: {
            colorScheme: {
                light: {
                    root: {
                        secondary: {
                            color:      "{primary.400}",
                            background: "transparent",
                            border:     {
                                color: "{primary.400}",
                            },
                            hover: {
                                color:      "{primary.500}",
                                background: "{primary.50}",
                                border:     {
                                    color: "{primary.500}",
                                },
                            },
                            active: {
                                color:      "{primary.600}",
                                background: "{primary.100}",
                                border:     {
                                    color: "{primary.500}",
                                },
                            },
                        },
                    },
                },
            },
        },
        panelmenu: {
            colorScheme: {
                light: {
                    root: {
                        item: {
                            color: "{primary.600}",
                            focus: {
                                color:      "{primary.600}",
                                background: "{surface.0}",
                            },
                        },
                    },
                },
            },
        },
        accordion: {
            colorScheme: {
                light: {
                    root: {
                        header: {
                            color:      "{primary.400}",
                            background: "{primary.100}",
                            hover:      {
                                color:      "{primary.600}",
                                background: "{primary.100}",
                            },
                            toggle: {
                                icon: {
                                    color: "{primary.400}",
                                    hover: {
                                        color: "{primary.600}",
                                    },
                                    active: {
                                        color: "{primary.500}",
                                        hover: {
                                            color: "{primary.600}",
                                        },
                                    },
                                },
                            },
                            active: {
                                color:      "{primary.500}",
                                background: "{secondary.500}",
                                hover:      {
                                    color:      "{primary.600}",
                                    background: "{secondary.500}",
                                },
                            },
                        },
                        content: {
                            color:      "{primary.500}",
                            background: "{secondary.500}",
                        },
                    },
                },
            },
        },
    },
    semantic: {
        typography: {
            fontSize: {
                h1: "2.7143rem",
                h2: "2.1429rem",
                h3: "1.5714rem",
                h4: "1.1429rem",
                h5: "0.8571rem",
                p:  "1rem",
            },
            lineHeight: {
                h1:   "3.2857rem",
                h2:   "2.7143rem",
                h3:   "2.1429rem",
                h4:   "1.5714rem",
                h5:   "1rem",
                p:    "1.5714rem",
                form: "1.8571rem",
            },
        },
        border: {
            radius: {
                none: "0px",
                xs:   "4px",
                sm:   "8px",
                md:   "12px",
                lg:   "16px",
                xl:   "20px",
            },
        },
        formField: {
            border: {
                radius: "{border.radius.xl}",
            },
            paddingX: "1.5714rem",
            paddingY: "0.797rem",
        },
        overlay: {
            modal: {
                padding: "2rem",
            },
        },
        primary: {
            0:   "#ffffff",
            50:  "#f3f9ff",
            100: "#f8fcff",
            150: "#e7f4fd",
            200: "#cfdce8",
            300: "#b2c8db",
            400: "#a0c5e4",
            500: "#749fc3",
            600: "#5a84aa",
            700: "#486a8b",
            800: "#3d5872",
            900: "#354a5e",
            950: "#222f3d",
        },
        secondary: {
            500: "#FFF7D7",
        },
        red: {
            50:  "#fef3f3",
            100: "#fee5e5",
            200: "#fecfcf",
            300: "#fcadae",
            400: "#f97f7f",
            500: "#f15757",
            600: "#df3c3c",
            700: "#c03333",
            800: "#a33232",
            900: "#8b3333",
            950: "#572323",
        },
        colorScheme: {
            light: {
                surface: {
                    0:   "#ffffff",
                    50:  "#f6f7f8",
                    100: "#d5d9de",
                    200: "#b4bbc5",
                    300: "#939cab",
                    400: "#717e91",
                    500: "#506077",
                    600: "#445265",
                    700: "#384353",
                    800: "#2c3541",
                    900: "#202630",
                    950: "#14181e",
                },
                primary: {
                    color: "{primary.500}",
                },
                formField: {
                    background:  "{primary.200}",
                    color:       "{primary.700}",
                    placeholder: {
                        color: "{primary.500}",
                    },
                    border: {
                        color: "{primary.500}",
                    },
                    hover: {
                        border: {
                            color: "{primary.400}",
                        },
                    },
                    focus: {
                        border: {
                            color: "{primary.600}",
                        },
                    },
                    invalid: {
                        border: {
                            color: "{red.500}",
                        },
                        placeholder: {
                            color: "{red.500}",
                        },
                    },
                    icon: {
                        color: "{primary.600}",
                    },
                    hint: {
                        color: "{primary.400}",
                    },
                },
                portal: {
                    card: {
                        background: "{primary.100}",
                        title:      {
                            fontWeight: "700",
                            color:      "{primary.500}",
                        },
                        description: {
                            color: "{primary.400}",
                        },
                        icon: {
                            color: "{primary.400}",
                        },
                        border: {
                            color: "transparent",
                        },
                    },
                    form: {
                        item: {
                            label: "{primary.500}",
                        },
                    },
                    menu: {
                        border: {
                            color: "{primary.500}",
                        },
                        background: "{primary.100}",
                        title:      {
                            color: "{primary.500}",
                        },
                        link: {
                            color: "{primary.500}",
                            focus: {
                                color: "{primary.500}",
                            },
                            hover: {
                                color: "{primary.700}",
                            },
                            active: {
                                color: "{primary.800}",
                            },
                        },
                        divider: {
                            color: "{primary.300}",
                        },
                    },
                    button: {
                        background: "{surface.0}",
                        color:      "{primary.500}",
                        border:     {
                            color: "{primary.500}",
                        },
                        active: {
                            color:  "{primary.700}",
                            border: {
                                color: "{primary.700}",
                            },
                        },
                        hover: {
                            color:  "{primary.600}",
                            border: {
                                color: "{primary.600}",
                            },
                        },
                    },
                    message: {
                        title: {
                            color: "{surface.0}",
                        },
                        description: {
                            color: "{surface.0}",
                        },
                    },
                    userCard: {
                        border: {
                            color: "{primary.400}",
                        },
                        link: {
                            color: "{primary.500}",
                        },
                    },
                },
                dashboard: {
                    sidebar: {
                        color:      "{primary.600}",
                        background: "{secondary.500}",
                        border:     {
                            radius: "{border.radius.md}",
                            color:  "{primary.200}",
                        },
                        item: {
                            color:  "{primary.500}",
                            active: {
                                background: "{primary.0}",
                                border:     {
                                    color: "{primary.500}",
                                },
                            },
                        },
                    },
                    background: "{primary.100}",
                    card:       {
                        background: "{primary.0}",
                        border:     {
                            color: "{primary.200}",
                        },
                    },
                    form: {
                        back: {
                            color: "{primary.300}",
                        },
                        border: {
                            color: "{primary.200}",
                        },
                        shadow: "{primary.200}",
                        label:  {
                            color: "{primary.500}",
                        },
                    },
                    settings: {
                        card: {
                            background: "{surface.0}",
                            border:     {
                                color: "{primary.200}",
                            },
                            title: {
                                color: "{primary.400}",
                            },
                            text: {
                                color: "{primary.300}",
                            },
                            hover: {
                                border: {
                                    color: "{primary.500}",
                                },
                                title: {
                                    color: "{primary.500}",
                                },
                            },
                            icon: {
                                color: "{primary.300}",
                            },
                        },
                    },
                },
                toolbar: {
                    item: {
                        header: {
                            color: "{primary.400}",
                        },
                    },
                },
                divider: {
                    border: {
                        color: "{content.border.color}",
                    },
                },
                content: {
                    border: {
                        color: "{primary.200}",
                    },
                },
                skeleton: {
                    invert: {
                        background: "rgba(0,0,0,0.2)",
                    },
                },
                chat: {
                    background: "{primary.100}",
                    border:     {
                        color:  "transparent",
                        radius: "{form.field.border.radius}",
                    },
                    message: {
                        text: "{primary.500}",
                        hint: "{primary.400}",
                    },
                    sent: {
                        color: "{primary.150}",
                    },
                    received: {
                        color: "{secondary.500}",
                    },
                    system: {
                        color: "{surface.50}",
                    },
                    scrollbar: {
                        color: "{form.field.background}",
                    },
                    empty: {
                        color: "{surface.500}",
                    },
                    files: {
                        link: {
                            hover: {
                                color: "{surface.600}",
                            },
                            active: {
                                color: "{surface.400}",
                            },
                        },
                    },
                },
                navigation: {
                    link: {
                        fontWeight: 700,
                        color:      "{primary.400}",
                        external:   {
                            color: "{primary.500}",
                        },
                        focus: {
                            color: "{primary.400}",
                        },
                        hover: {
                            color: "{primary.500}",
                        },
                        active: {
                            color: "{primary.600}",
                        },
                    },
                    divider: {
                        color: "{primary.500}",
                    },
                },
                timelineCalendar: {
                    day: {
                        number: {
                            color: "{primary.500}",
                        },
                        name: {
                            color: "{primary.500}",
                        },
                    },
                    weekend: {
                        background: "{gray.600}",
                        color:      "{primary.600}",
                    },
                    today: {
                        background: "{primary.500}",
                        color:      "{surface.0}",
                    },
                    navigate: {
                        color: "{primary.400}",
                        hover: {
                            color: "{primary.500}",
                        },
                    },
                },
                auth: {
                    input: {
                        placeholder: {
                            color: "{primary.0}",
                        },
                        background: "rgba(160, 197, 228, 1)",
                        border:     {
                            color: "rgba(160, 197, 228, 1)",
                        },
                        hover: {
                            border: {
                                color: "{primary.500}",
                            },
                        },
                        focus: {
                            border: {
                                color: "{primary.500}",
                            },
                        },
                    },
                    checkbox: {
                        label: {
                            color: "{surface.0}",
                        },
                    },
                },
                btn: {
                    group: {
                        color:      "{primary.400}",
                        background: "transparent",
                        border:     {
                            color: "{primary.400}",
                        },
                        hover: {
                            background: "{primary.500}",
                            color:      "{surface.0}",
                        },
                        active: {
                            background: "{primary.600}",
                            color:      "{surface.0}",
                        },
                    },
                },
                chart: {
                    bar: {
                        month: {
                            color: "{primary.500}",
                        },
                        value: {
                            color: "{primary.500}",
                        },
                        empty: {
                            color:      "{primary.500}",
                            background: "{primary.600}",
                        },
                    },
                },
                cloud: {
                    title:  "{primary.500}",
                    folder: {
                        color: "{secondary.500}",
                        hover: {
                            color: "{primary.500}",
                        },
                    },
                    file: {
                        color:      "{surface.0}",
                        background: "{secondary.500}",
                    },
                },
                list: {
                    loading: {
                        background: "transparent",
                    },
                },
                empty: {
                    color:  "{primary.400}",
                    border: {
                        color: "{primary.200}",
                    },
                },
                glow: {
                    color: "{primary.500}",
                },
                dropbox: {
                    background: "{primary.50}",
                    color:      "{primary.500}",
                    border:     {
                        color:  "transparent",
                        radius: "{form.field.border.radius}",
                    },
                    hover: {
                        border: {
                            color: "{form.field.hover.border.color}",
                        },
                    },
                    disabled: {
                        color:      "{primary.500}",
                        background: "{form.field.disabled.background}",
                    },
                    files: {
                        color: "{primary.500}",
                        hover: {
                            color: "{primary.400}",
                        },
                        remove: "{red.500}",
                    },
                },
                link: {
                    color: "{primary.400}",
                    hover: {
                        color: "{primary.500}",
                    },
                    active: {
                        color: "{primary.600}",
                    },
                    external: {
                        color: "{primary.color}",
                    },
                },
                panel: {
                    subtext: "{primary.400}",
                    hint:    "{primary.300}",
                    value:   "{primary.500}",
                    border:  {
                        color: "{primary.500}",
                    },
                    royalty: {
                        legend: {
                            label: "{primary.500}",
                            all:   {
                                background: "{primary.400}",
                                border:     {
                                    color: "{primary.700}",
                                },
                            },
                            total: {
                                background: "{amber.300}",
                                border:     {
                                    color: "{amber.300}",
                                },
                            },
                            turnover: {
                                background: "{amber.500}",
                            },
                        },
                        revenue: "{amber.500}",
                        income:  "{amber.300}",
                        ticks:   "{primary.300}",
                    },
                },
            },
        },
    },
}
