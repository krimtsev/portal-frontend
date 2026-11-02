import type { Component } from "vue"

type TemplateLoader = () => Promise<{ default: Component }>

/**
 * Реестр "template"-диалогов. Ключ — PromoDialog.code из БД.
 * Для нового шаблона: добавить .vue-файл и строчку здесь.
 */
export const promoDialogTemplates: Record<string, TemplateLoader> = {
    "britva-ten-years": () => import("@c/promo-dialog/templates/britva-ten-years-template.vue"),
}
