import sanitizeHtml from "sanitize-html"

export function $sanitizeHtml (dirty: string) {
    return sanitizeHtml(dirty, {
        allowedTags: ["br", "b", "ul", "ol", "li", "span", "p", "samp", "pre", "img"],
        allowedAttributes: {
            a: [ "href" ],
            span: ["class"],
            img: ["src"]
        },
        selfClosing: ["br", "img"],
        allowedSchemesAppliedToAttributes: [],
        disallowedTagsMode: "escape"
    })
}

