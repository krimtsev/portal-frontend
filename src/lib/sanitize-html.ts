import DOMPurify from "dompurify"

export function $sanitizeHtml (dirty: string, escape: boolean = false): string {

    if (escape) {
         dirty = dirty
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ["br", "b", "ul", "ol", "li", "span", "p", "samp", "pre", "img"],
        ALLOWED_ATTR: ["href", "class", "src"],

        // Включаем разрешённые схемы, аналог allowedSchemesAppliedToAttributes
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data:image\/))/i,

        // Аналог disallowedTagsMode: "escape"
        // (DOMPurify по умолчанию удаляет запрещённые теги, но можно включить escape)
        WHOLE_DOCUMENT: false,
        RETURN_DOM_FRAGMENT: false
    })
}

