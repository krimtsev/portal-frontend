import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "@r/router"
import i18n from "./plugins/i18n"
import PrimeVue from "primevue/config"
import PrimeRipple from "primevue/ripple"
import PrimeTooltip from "primevue/tooltip"
import PrimeToastService from "primevue/toastservice"
import { themeConfig } from "./plugins/prime/prime-vue"
import "@a/styles/index.scss"
import "primeicons/primeicons.css"
import GlowDirective from "@/directives/glow"

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(PrimeVue, themeConfig)
    .use(PrimeToastService)
    .use(i18n)
    .use(router)
    .directive("glow", GlowDirective)
    .directive("ripple", PrimeRipple)
    .directive("tooltip", PrimeTooltip)
    .mount("#app")
