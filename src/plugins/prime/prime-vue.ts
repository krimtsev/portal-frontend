import partnerConfig from "@a/prime/prime-config"
import { definePreset } from "@primeuix/themes"
import Aura from "@primeuix/themes/aura"
import { ru } from "./prime-locale.json"

//@ts-ignore
const preset = definePreset(Aura, partnerConfig)

export const themeConfig = {
    theme: {
        preset,
        options: {
            prefix:           "p",
            darkModeSelector: ".dark-mode",
        },
        dark: true,
    },
    ripple:       true,
    inputVariant: "outlined",
    locale:       ru,
}

