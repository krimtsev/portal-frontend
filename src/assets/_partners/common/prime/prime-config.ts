export default {
    components: {
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
        button: {
            paddingX: "{button.paddingX}",
            paddingY: "{button.paddingY}",
        },
        datatable: {
            colorScheme: {
                dark: {
                    header: {
                        cell: {
                            border: {
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
                },
            },
        },
        treetable: {
            colorScheme: {
                dark: {
                    header: {
                        cell: {
                            border: {
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
                        background:          "rgba(150, 150, 150, 0.2)",
                        animationBackground: "rgba(255, 255, 255, 0.1)",
                    },
                },
                light: {
                    root: {
                        background:          "rgba(255, 255, 255, 0.2)",
                        animationBackground: "rgba(255, 255, 255, 0.1)",
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
                        colorOne:   "{primary.100}",
                        colorTwo:   "{primary.300}",
                        colorThree: "{primary.500}",
                        colorFour:  "{primary.700}",
                    },
                },
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
    },
    semantic: {
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
        primary: {
            0:   "#ffffff",
            50:  "#f4f8fd",
            100: "#cadef6",
            200: "#a1c4ef",
            300: "#77aae7",
            400: "#4e90e0",
            500: "#2476d9",
            600: "#1f64b8",
            700: "#195398",
            800: "#144177",
            900: "#0e2f57",
            950: "#091e36",
        },
        button: {
            paddingX: "1.1429rem",
            paddingY: "0.797rem",
        },
        overlay: {
            modal: {
                padding: "2rem",
            },
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
                    invalidPlaceholderColor: "{surface.500}",
                    invalidBorderColor:      "{red.500}",
                    background:              "{surface.0}",
                },
                portal: {
                    card: {
                        background: "#111111",
                    },
                    button: {
                        border: {
                            color: "rgba(255, 255, 255, 0.16)",
                        },
                        active: {
                            border: {
                                color: "rgba(255, 255, 255, 0.3)",
                            },
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
                    sent: {
                        color: "{primary.300}",
                    },
                    received: {
                        color: "{slate.300}",
                    },
                    system: {
                        color: "{surface.300}",
                    },
                },
            },
            dark: {
                surface: {
                    0:   "#ffffff",
                    50:  "#f8f8f8",
                    100: "#dddddd",
                    200: "#c2c2c2",
                    300: "#a7a7a6",
                    400: "#8c8c8b",
                    500: "#717170",
                    600: "#60605f",
                    700: "#4f4f4e",
                    800: "#3e3e3e",
                    900: "#2d2d2d",
                    950: "#1c1c1c",
                },
                primary: {
                    color: "{primary.500}",
                },
                formField: {
                    invalidPlaceholderColor: "{surface.500}",
                    invalidBorderColor:      "{red.500}",
                    background:              "{surface.950}",
                },
                portal: {
                    card: {
                        background: "#111111",
                    },
                    button: {
                        border: {
                            color: "rgba(255, 255, 255, 0.16)",
                        },
                        active: {
                            border: {
                                color: "rgba(255, 255, 255, 0.3)",
                            },
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
                    sent: {
                        color: "{primary.300}",
                    },
                    received: {
                        color: "{slate.300}",
                    },
                    system: {
                        color: "{surface.300}",
                    },
                },
            },
        },
    },
}
