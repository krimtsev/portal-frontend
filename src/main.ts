import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "./App.vue"
import i18n from "./plugins/i18n"
import router from "@/router"

import(/* webpackChunkName: "fonts" */"@a/styles/fonts.css")
import "@a/styles/index.scss"
import "primeicons/primeicons.css"

import PrimeVue from "primevue/config"
import PrimeRipple from "primevue/ripple"
import PrimeToastService from "primevue/toastservice"
import PrimeTooltip from "primevue/tooltip"
import { themeConfig } from "./plugins/prime/prime-vue"
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
