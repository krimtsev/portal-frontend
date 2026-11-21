import DOMPurify from "dompurify"

export function $sanitizeHtml(dirty: string, escape: boolean = false): string {

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
        WHOLE_DOCUMENT:      false,
        RETURN_DOM_FRAGMENT: false,
    })
}

function normalize(html: string): string {
    return html.replace(/&nbsp;|\u00A0/g, " ")
        .replace(/<p>\s*<\/p>/g, "<br>")
        .trim()
}

export function $sanitizeEditorHtml(dirty: string): string {
    const clean = DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ["br", "p", "strong", "b", "em", "i", "u", "s", "strike", "ol", "ul", "li"],

        // в редакторе нет ссылок/картинок/классов
        ALLOWED_ATTR: [],

        // никаких href/src
        ALLOWED_URI_REGEXP: /^$/,

        // текст из запрещённых тегов сохраняем
        KEEP_CONTENT:        true,
        WHOLE_DOCUMENT:      false,
        RETURN_DOM_FRAGMENT: false,
    })

    return normalize(clean)
}
