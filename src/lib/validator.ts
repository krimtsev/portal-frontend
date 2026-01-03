export const reg = {
    password: new RegExp(/^\\S+$/),
    mobileTelnum:   new RegExp("^[\\+]?\\d{11}$"),
}

function check(value: any, format: RegExp) {
    return value ? format.test(value) : false
}

export const isPassword = (val: string) => check(val, reg.password)
export const isMobileTelnum = (val: string) => check(val, reg.mobileTelnum)
