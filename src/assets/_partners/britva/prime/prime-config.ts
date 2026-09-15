export default {
    components: {
        breadcrumb: {
            colorScheme: {
                dark: {
                    root: {
                        padding:    0,
                        background: "transparent",
                        item:       {
                            color: "{surface.300}",
                            link:  "{surface.0}",
                        },
                        separator: {
                            color: "{surface.300}",
                        },
                        last: {
                            color: "{surface.0}",
                        },
                    },
                },
            },
        },
        menubar: {
            colorScheme: {
                dark: {
                    root: {
                        base: {
                            item: {
                                border: {
                                    radius: "2.286rem",
                                },
                                font: {
                                    weight: "400",
                                },
                            },
                        },
                        item: {
                            color:  "{surface.0}",
                            border: {
                                color:  "{surface.600}",
                                radius: "2.286rem",
                            },
                            focus: {
                                background: "{surface.800}",
                                color:      "{surface.0}",
                            },
                            active: {
                                background: "{surface.800}",
                                color:      "{surface.0}",
                            },
                        },
                        submenu: {
                            color:  "{primary.500}",
                            border: {
                                radius: "1.714rem",
                                color:  "{surface.600}",
                            },
                            icon: {
                                color: "{surface.500}",
                                focus: {
                                    color: "{surface.500}",
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
                dark: {
                    root: {
                        background:  "{surface.950}",
                        placeholder: {
                            color: "{surface.400}",
                        },
                        disabled: {
                            color:           "{surface.400}",
                            backgroundColor: "{surface.0}",
                        },
                    },
                },
            },
        },
        textarea: {
            colorScheme: {
                dark: {
                    root: {
                        background:  "{surface.950}",
                        placeholder: {
                            color: "{surface.400}",
                        },
                        disabled: {
                            color:           "{primary.500}",
                            backgroundColor: "{surface.0}",
                        },
                        label: {
                            color: "{surface.500}",
                        },
                    },
                },
            },
        },
        select: {
            colorScheme: {
                dark: {
                    root: {
                        background:  "{surface.950}",
                        placeholder: {
                            color: "{surface.400}",
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
                dark: {
                    root: {
                        background:  "{surface.950}",
                        placeholder: {
                            color: "{surface.400}",
                        },
                        disabled: {
                            color:           "{surface.400}",
                            backgroundColor: "{surface.0}",
                        },
                        option: {
                            color: "{surface.0}",
                            focus: {
                                color:      "{surface.0}",
                                background: "{surface.800}",
                            },
                            group: {
                                color: "{surface.400}",
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
                            color: "{surface.0}",
                            hover: {
                                color:      "{surface.0}",
                                background: "{surface.800}",
                            },
                        },
                        select: {
                            year: {
                                color: "{surface.0}",
                                hover: {
                                    color:      "{surface.0}",
                                    background: "{surface.800}",
                                },
                            },
                        },
                    },
                },
            },
        },
        togglebutton: {
            colorScheme: {
                dark: {
                    root: {
                        background: "{surface.950}",
                        color:      "{surface.400}",
                        hover:      {
                            color:      "{surface.300}",
                            background: "{surface.950}",
                        },
                        border: {
                            color: "{surface.950}",
                        },
                        checked: {
                            color:      "{surface.950}",
                            background: "{surface.950}",
                            border:     {
                                color: "{surface.950}",
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
                dark: {
                    header: {
                        color: "{surface.0}",
                        cell:  {
                            background: "transparent",
                            border:     {
                                color: "{content.border.color}",
                            },
                        },
                    },
                    body: {
                        cell: {
                            border: {
                                color: "{content.border.color}",
                            },
                            padding: "0.9rem 1rem",
                        },
                    },
                    row: {
                        color:      "{surface.0}",
                        background: "transparent",
                        hover:      {
                            color:      "{primary.300}",
                            background: "{surface.700}",
                        },
                    },
                    footer: {
                        color: "{surface.0}",
                        cell:  {
                            color:      "{surface.0}",
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
                dark: {
                    header: {
                        cell: {
                            color:      "{surface.0}",
                            background: "transparent",
                            border:     {
                                color: "{surface.600}",
                            },
                        },
                    },
                    body: {
                        cell: {
                            border: {
                                color: "{surface.600}",
                            },
                        },
                    },
                    row: {
                        color:      "{surface.0}",
                        background: "{surface.800}",
                        hover:      {
                            color:      "{primary.300}",
                            background: "{surface.700}",
                        },
                    },
                    node: {
                        toggle: {
                            button: {
                                color: "{surface.400}",
                            },
                        },
                    },
                },
            },
        },
        paginator: {
            colorScheme: {
                dark: {
                    color: "{surface.0}",
                    nav:   {
                        button: {
                            color:    "{surface.400}",
                            selected: {
                                color:      "{primary.200}",
                                background: "{surface.700}",
                            },
                            hover: {
                                color:      "{surface.300}",
                                background: "{surface.800}",
                                border:     {
                                    color: "{surface.800}",
                                },
                            },
                        },
                    },
                },
            },
        },
        toast: {
            colorScheme: {
                dark: {
                    error: {
                        color:      "{red.50}",
                        background: "{red.500}",
                    },
                },
            },
        },
        skeleton: {
            colorScheme: {
                dark: {
                    root: {
                        background: "rgba(255, 255, 255, 0.2)",
                        animation:  {
                            background: "rgba(255, 255, 255, 0.1)",
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
                dark: {
                    disabled: {
                        background: "{surface.700}",
                        color:      "{surface.400}",
                    },
                    active: {
                        background: "rgba(139, 92, 246, 0.2)",
                        color:      "{violet.300}",
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
                dark: {
                    root: {
                        color:      "{surface.0}",
                        background: "{surface.600}",
                    },
                },
            },
        },
        tooltip: {
            root: {
                maxWidth: "20rem",
            },
            colorScheme: {
                dark: {
                    root: {
                        background: "rgb(51 51 51)",
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
                dark: {
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
                dark: {
                    root: {
                        colorOne:   "{primary.100}",
                        colorTwo:   "{primary.300}",
                        colorThree: "{primary.500}",
                        colorFour:  "{primary.700}",
                    },
                },
            },
        },
        tabs: {
            colorScheme: {
                dark: {
                    root: {
                        tab: {
                            padding: "1.1429rem 1.1429rem",
                            color:   "{surface.400}",
                            hover:   {
                                color: "{surface.0}",
                            },
                        },
                    },
                },
            },
        },
        checkbox: {
            colorScheme: {
                dark: {
                    label: {
                        color: "{surface.0}",
                    },
                    background: "{surface.900}",
                },
            },
        },
        button: {
            colorScheme: {
                dark: {
                    root: {
                        secondary: {
                            color:      "{surface.200}",
                            background: "{surface.800}",
                            border:     {
                                color: "{surface.600}",
                            },
                            hover: {
                                color:      "{surface.200}",
                                background: "{surface.700}",
                                border:     {
                                    color: "transparent",
                                },
                            },
                            active: {
                                color:      "{surface.200}",
                                background: "{surface.600}",
                                border:     {
                                    color: "transparent",
                                },
                            },
                        },
                    },
                },
            },
        },
        panelmenu: {
            colorScheme: {
                dark: {
                    root: {
                        item: {
                            color: "{surface.0}",
                            focus: {
                                color:      "{surface.0}",
                                background: "{surface.800}",
                            },
                        },
                    },
                },
            },
        },
        accordion: {
            colorScheme: {
                dark: {
                    root: {
                        header: {
                            color:      "{surface.200}",
                            background: "{surface.800}",
                            hover:      {
                                color:      "{surface.0}",
                                background: "{surface.800}",
                            },
                            toggle: {
                                icon: {
                                    color: "{surface.200}",
                                    hover: {
                                        color: "{surface.0}",
                                    },
                                    active: {
                                        color: "{surface.0}",
                                        hover: {
                                            color: "{surface.0}",
                                        },
                                    },
                                },
                            },
                            active: {
                                color:      "{surface.100}",
                                background: "{surface.800}",
                                hover:      {
                                    color:      "{surface.0}",
                                    background: "{surface.800}",
                                },
                            },
                        },
                        content: {
                            color:      "{surface.0}",
                            background: "{surface.800}",
                        },
                    },
                },
            },
        },
    },
    semantic: {
        typography: {
            fontSize: {
                h1: "2.8571rem", // 40px
                h2: "2.2857rem", // 32px
                h3: "1.7143rem", // 24px
                h4: "1.2857rem", // 18px
                h5: "1rem", // 14px
                p:  "1.1429rem", // 16px
            },
            lineHeight: {
                h1:   "3.4286rem", // 48px
                h2:   "2.8571rem", // 40px
                h3:   "2.2857rem", // 32px
                h4:   "1.7143rem", // 24px
                h5:   "1.1429rem", // 16px
                p:    "1.7143rem", // 24px
                form: "2rem", // 28px
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
            50:  "#fbfcf4",
            100: "#edf3c9",
            200: "#dee99e",
            300: "#cfdf74",
            400: "#c1d549",
            500: "#b2cb1e",
            600: "#97ad1a",
            700: "#7d8e15",
            800: "#627011",
            900: "#47510c",
            950: "#2d3308",
        },
        secondary: {
            500: "#b2cb1e",
        },
        red: {
            50:  "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            950: "#450a0a",
        },
        colorScheme: {
            dark: {
                surface: {
                    0:   "#ffffff",
                    50:  "#f0f0f0",
                    100: "#e0e0e0",
                    200: "#d0d0d0",
                    300: "#b3b3b3",
                    400: "#808080",
                    500: "#595959",
                    600: "#333333",
                    700: "#1a1a1a",
                    800: "#111111",
                    900: "#0d0d0d",
                    950: "#020202",
                },
                primary: {
                    color: "{primary.500}",
                },
                formField: {
                    background:  "{surface.950}",
                    color:       "{surface.50}",
                    placeholder: {
                        color: "{surface.500}",
                    },
                    border: {
                        color: "{surface.600}",
                    },
                    hover: {
                        border: {
                            color: "{surface.500}",
                        },
                    },
                    focus: {
                        border: {
                            color: "{primary.500}",
                        },
                    },
                    invalid: {
                        border: {
                            color: "{red.500}",
                        },
                        placeholder: {
                            color: "{surface.500}",
                        },
                    },
                    icon: {
                        color: "{surface.400}",
                    },
                    hint: {
                        color: "{surface.400}",
                    },
                },
                portal: {
                    card: {
                        background: "{surface.800}",
                        title:      {
                            fontWeight: "500",
                            color:      "rgba(255, 255, 255, 0.9)",
                        },
                        description: {
                            color: "{surface.400}",
                        },
                        icon: {
                            color: "{surface.400}",
                        },
                        border: {
                            color: "transparent",
                        },
                    },
                    form: {
                        item: {
                            label: "{surface.400}",
                        },
                    },
                    menu: {
                        border: {
                            color: "{surface.800}",
                        },
                        background: "{surface.800}",
                        title:      {
                            color: "{surface.400}",
                        },
                        link: {
                            color: "{surface.100}",
                            focus: {
                                color: "{surface.400}",
                            },
                            hover: {
                                color: "{primary.500}",
                            },
                            active: {
                                color: "{primary.700}",
                            },
                        },
                        divider: {
                            color: "{surface.600}",
                        },
                    },
                    button: {
                        background: "{surface.800}",
                        color:      "{surface.0}",
                        border:     {
                            color: "rgba(255, 255, 255, 0.16)",
                        },
                        active: {
                            border: {
                                color: "rgba(255, 255, 255, 0.3)",
                            },
                        },
                        hover: {
                            color:  "{surface.0}",
                            border: {
                                color: "rgba(255, 255, 255, 0.3)",
                            },
                        },
                    },
                    message: {
                        title: {
                            color: "{surface.950}",
                        },
                        description: {
                            color: "{surface.950}",
                        },
                    },
                    userCard: {
                        border: {
                            color: "{surface.600}",
                        },
                        link: {
                            color: "{surface.0}",
                        },
                    },
                },
                dashboard: {
                    sidebar: {
                        background: "{surface.950}",
                        border:     {
                            radius: "0px",
                            color:  "transparent",
                        },
                        item: {
                            color:  "{surface.0}",
                            active: {
                                background: "{surface.800}",
                                border:     {
                                    color: "{primary.500}",
                                },
                            },
                        },
                    },
                    background: "{surface.950}",
                    card:       {
                        background: "{surface.800}",
                        border:     {
                            color: "{surface.800}",
                        },
                    },
                    form: {
                        back: {
                            color: "{surface.100}",
                        },
                        border: {
                            color: "transparent",
                        },
                        shadow: "{surface.600}",
                        label:  {
                            color: "{surface.0}",
                        },
                    },
                    settings: {
                        card: {
                            background: "{surface.800}",
                            border:     {
                                color: "{surface.600}",
                            },
                            title: {
                                color: "{surface.0}",
                            },
                            text: {
                                color: "{surface.400}",
                            },
                            hover: {
                                border: {
                                    color: "{primary.800}",
                                },
                                title: {
                                    color: "{primary.500}",
                                },
                            },
                            icon: {
                                color: "{surface.0}",
                            },
                        },
                    },
                },
                toolbar: {
                    item: {
                        header: {
                            color: "{surface.200}",
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
                        color: "{surface.600}",
                    },
                },
                skeleton: {
                    invert: {
                        background: "rgba(0,0,0,0.2)",
                    },
                },
                chat: {
                    background: "{form.field.background}",
                    border:     {
                        color:  "{form.field.border.color}",
                        radius: "{form.field.border.radius}",
                    },
                    message: {
                        text: "{surface.950}",
                        hint: "{surface.500}",
                    },
                    sent: {
                        color: "{primary.300}",
                    },
                    received: {
                        color: "{slate.300}",
                    },
                    system: {
                        color: "{surface.300}",
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
                        fontWeight: 400,
                        color:      "{surface.0}",
                        external:   {
                            color: "{primary.500}",
                        },
                        focus: {
                            color: "{primary.500}",
                        },
                        hover: {
                            color: "{primary.300}",
                        },
                        active: {
                            color: "{primary.200}",
                        },
                    },
                    divider: {
                        color: "{surface.500}",
                    },
                },
                timelineCalendar: {
                    day: {
                        number: {
                            color: "{surface.0}",
                        },
                        name: {
                            color: "{surface.400}",
                        },
                    },
                    weekend: {
                        background: "{gray.500}",
                        color:      "{gray.400}",
                    },
                    today: {
                        background: "{primary.500}",
                        color:      "{surface.800}",
                    },
                    navigate: {
                        color: "{surface.400}",
                        hover: {
                            color: "{surface.300}",
                        },
                    },
                },
                auth: {
                    input: {
                        placeholder: {
                            color: "{surface.400}",
                        },
                        background: "{surface.950}",
                        border:     {
                            color: "{surface.600}",
                        },
                        hover: {
                            border: {
                                color: "{surface.500}",
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
                        color:      "{surface.300}",
                        background: "transparent",
                        border:     {
                            color: "{surface.600}",
                        },
                        hover: {
                            color:      "{surface.200}",
                            background: "transparent",
                            border:     {
                                color: "{surface.600}",
                            },
                        },
                        active: {
                            background: "transparent",
                            color:      "{surface.200}",
                            border:     {
                                color: "{surface.600}",
                            },
                        },
                    },
                },
                chart: {
                    bar: {
                        month: {
                            color: "{surface.500}",
                        },
                        value: {
                            color: "{surface.0}",
                        },
                        empty: {
                            color:      "rgba(0,0,0,0.1)",
                            background: "rgba(255,255,255,0.08)",
                        },
                    },
                },
                cloud: {
                    title:  "{surface.500}",
                    folder: {
                        color: "{surface.700}",
                        hover: {
                            color: "{primary.500}",
                        },
                    },
                    file: {
                        color:      "{surface.0}",
                        background: "{surface.950}",
                    },
                },
                list: {
                    loading: {
                        background: "transparent",
                    },
                },
                empty: {
                    color:  "{surface.300}",
                    border: {
                        color: "{primary.200}",
                    },
                },
                glow: {
                    color: "rgba(255,255,255,0.9)",
                },
                dropbox: {
                    background: "{form.field.background}",
                    color:      "{surface.500}",
                    border:     {
                        color:  "{form.field.border.color}",
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
                        color: "{surface.400}",
                        hover: {
                            color: "{surface.300}",
                        },
                        remove: "{red.500}",
                    },
                },
                link: {
                    color: "{surface.0}",
                    hover: {
                        color: "{primary.hover.color}",
                    },
                    active: {
                        color: "{primary.active.color}",
                    },
                    external: {
                        color: "{primary.color}",
                    },
                },
                panel: {
                    subtext: "{surface.400}",
                    hint:    "{surface.500}",
                    value:   "{surface.0}",
                    border:  {
                        color: "{surface.600}",
                    },
                    period: {
                        trend: {
                            up: {
                                background: "{green.900}",
                                color:      "{green.300}",
                            },
                            down: {
                                background: "{red.900}",
                                color:      "{red.300}",
                            },
                        },
                    },
                    royalty: {
                        legend: {
                            label: "{surface.0}",
                            all:   {
                                background: "{primary.400}",
                                border:     {
                                    color: "{primary.700}",
                                },
                            },
                            total: {
                                background: "{lime.600}",
                                border:     {
                                    color: "{lime.600}",
                                },
                            },
                            turnover: {
                                background: "{lime.800}",
                            },
                        },
                        revenue: "{lime.800}",
                        income:  "{lime.600}",
                        ticks:   "{neutral.400}",
                    },
                },
            },
        },
    },
}
