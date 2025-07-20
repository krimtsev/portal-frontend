export default {
    components: {
        message: {
            text: {
                font: {
                    size: "1rem"
                },
                sm: {
                    font:{
                        size: "0.8571rem"
                    }
                },
                lg: {
                    font: {
                        size: "1.1429rem"
                    }
                }
            }
        },
        button: {
            paddingY: "0.797rem",
            paddingX: "1.1429rem",
        },
        datatable: {
            colorScheme: {
                dark: {
                    header: {
                        cell: {
                            border: {
                                color: "{surface.600}"
                            }
                        }
                    },
                    body: {
                        cell: {
                            border: {
                                color: "{surface.600}"
                            }
                        }
                    }
                }
            },
        },
        toast: {
            colorScheme: {
                dark: {
                    error: {
                        color: "{red.50}",
                        background: "{red.500}"
                    }
                }
            }
        }
    },
    semantic: {
        border: {
            radius: {
                none: "0px",
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "20px"
            }
        },
        formField: {
            border: {
                radius: "{border.radius.xl}"
            },
            paddingX: "1.5714rem",
            paddingY: "0.797rem",
        },
        primary: {
            0: "#ffffff",
            50: "#fbfcf4",
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
        colorScheme: {
            light: {
                surface: {
                    0: "#ffffff",
                    50: "#f6f7f8",
                    100: "#d5d9de",
                    200: "#b4bbc5",
                    300: "#939cab",
                    400: "#717e91",
                    500: "#506077",
                    600: "#445265",
                    700: "#384353",
                    800: "#2c3541",
                    900: "#202630",
                    950: "#14181e"
                },
                primary: {
                    color: "{primary.500}"
                },
                formField: {
                    invalidPlaceholderColor: "{surface.500}",
                    invalidBorderColor: "{red.500}",
                    background: "{surface.0}"
                },
                portal: {
                    card: {
                        background: "#111111"
                    }
                }
            },
            dark: {
                surface: {
                    0: "#ffffff",
                    50: "#f0f0f0",
                    100: "#e0e0e0",
                    200: "#d0d0d0",
                    300: "#b3b3b3",
                    400: "#808080",
                    500: "#595959",
                    600: "#333333",
                    700: "#1a1a1a",
                    800: "#111111",
                    900: "#0d0d0d",
                    950: "#020202"
                },
                primary: {
                    color: "{primary.500}"
                },
                formField: {
                    invalidPlaceholderColor: "{surface.500}",
                    invalidBorderColor: "{red.500}",
                    background: "{surface.950}"
                },
                portal: {
                    card: {
                        background: "#111111"
                    }
                }
            }
        }
    },
}
