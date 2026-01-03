export interface PortalPage {
    title: string;
    rightImage?: string
    isSubmitting?: boolean // Прелоадер для отправки данных
    isLoading?: boolean // Прелоадер для загрузки страницы
    isLoadingTitle?: boolean
    isLoadingContent?: boolean
}
