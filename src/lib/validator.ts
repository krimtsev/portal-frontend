export const reg = {
    password: new RegExp(/^\\S+$/),
    mobileTelnum:   new RegExp("^[\\+]?\\d{11}$"),
    isoDate: new RegExp(/^\d{4}-\d{2}-\d{2}$/),
}

function check(value: any, format: RegExp) {
    return value ? format.test(value) : false
}

export const isPassword = (val: string) => check(val, reg.password)
export const isMobileTelnum = (val: string) => check(val, reg.mobileTelnum)
export const isIsoDate = (val: string) => check(val, reg.isoDate)
