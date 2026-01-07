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
            paddingX: "{button.paddingX}",
            paddingY: "{button.paddingY}"
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
                    },
                    row: {
                        hover: {
                            background: "{surface.700}"
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
        },
        skeleton: {
            colorScheme: {
                dark: {
                    root: {
                        background: "rgba(150, 150, 150, 0.2)",
                        animationBackground: "rgba(255, 255, 255, 0.1)",
                    },
                },
                light: {
                    root: {
                        background: "rgba(255, 255, 255, 0.2)",
                        animationBackground: "rgba(255, 255, 255, 0.1)",
                    },
                }
            },
        },
        avatar: {
            root: {
                width: "2.643rem",
                height: "2.643rem",
                fontSize: "1.3rem",
            }
        },
    },
    semantic: {
        border: {
            radius: {
                none: "0px",
                xs: "4px",
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "20px",
            }
        },
        button: {
            paddingX: "1.1429rem",
            paddingY: "0.797rem"
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
                    },
                    button: {
                        outline: {
                            border: {
                                color: "{surface.300}"
                            },
                        }
                    }
                },
                dashboard: {
                    card: {
                        background: "#111111"
                    },
                },
                divider: {
                    border: {
                        color: "{content.border.color}"
                    },
                },
                content: {
                    border: {
                        color: "{surface.600}"
                    }
                },
                skeleton: {
                    invert: {
                        background: "rgba(0,0,0,0.2)"
                    }
                },
                chat: {
                    sent: {
                        color: "{primary.300}"
                    },
                    received: {
                        color: "{slate.300}"
                    },
                    system: {
                        color: "{surface.300}"
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
                    },
                    button: {
                        outline: {
                            border: {
                                color: "#2b2b2b"
                            },
                        }
                    }
                },
                divider: {
                    border: {
                        color: "{content.border.color}"
                    },
                },
                content: {
                    border: {
                        color: "{surface.600}"
                    }
                },
                skeleton: {
                    invert: {
                        background: "rgba(0,0,0,0.2)"
                    }
                },
                chat: {
                    sent: {
                        color: "{primary.300}"
                    },
                    received: {
                        color: "{slate.300}"
                    },
                    system: {
                        color: "{surface.300}"
                    }
                },
            }
        }
    },
}
