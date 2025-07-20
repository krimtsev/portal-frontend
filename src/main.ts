import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import i18n from "./plugins/i18n"
import PrimeVue from "primevue/config"
import ToastService from "primevue/toastservice"
import { themeConfig } from "./plugins/prime-vue"
import "@a/styles/index.scss"
import "primeicons/primeicons.css"

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(PrimeVue, themeConfig)
    .use(ToastService)
    .use(i18n)
    .use(router)
    .mount("#app")
