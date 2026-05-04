export function getCookie(name: string) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
    if (match) {
        return match[2]
    }
    return null
}

export function deleteCookie(name: string, path: string = "/", domain?: string) {
    let cookieString = `${name}=; Max-Age=-1; path=${path}; SameSite=Lax`
    if (domain) {
        cookieString += `; domain=${domain}`
    }
    document.cookie = cookieString
}
