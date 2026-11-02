export enum PromoDialogType {
    Template = "template",
    Custom = "custom",
}

export interface PromoDialog {
    id:          number
    code:        string
    title:       string
    description: string
    type:        PromoDialogType
}
