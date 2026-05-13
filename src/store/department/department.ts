import { computed } from "vue"
import { defineStore } from "pinia"
import { useI18n } from "vue-i18n"
import {
    DepartmentType,
    type DepartmentItem,
} from "@/definitions/departments.ts"

export const useDepartmentStore = defineStore("departments", () => {
    const { t } = useI18n()

    const list: DepartmentItem[] = [
        {
            id:    1,
            type:  DepartmentType.Franchise,
            title: t("mc.department.franchise"),
        },
        {
            id:    2,
            type:  DepartmentType.Build,
            title: t("mc.department.build"),
        },
        {
            id:    3,
            type:  DepartmentType.Marketing,
            title: t("mc.department.marketing"),
        },
        {
            id:    4,
            type:  DepartmentType.NetworkAdmin,
            title: t("mc.department.network_admin"),
        },
        {
            id:    5,
            type:  DepartmentType.NetworkBarbering,
            title: t("mc.department.network_barbering"),
        },
        {
            id:    6,
            type:  DepartmentType.Community,
            title: t("mc.department.community"),
        },
        {
            id:    7,
            type:  DepartmentType.OfficeManager,
            title: t("mc.department.office_manager"),
        },
        {
            id:    8,
            type:  DepartmentType.ItDepartment,
            title: t("mc.department.it_department"),
        },
        {
            id:    9,
            type:  DepartmentType.Accounting,
            title: t("mc.department.accounting"),
        },
    ]

    const departmentsMap = computed(() => {
        return list.reduce((acc, item) => {
            acc[item.id] = item
            return acc
        }, {} as Record<number, DepartmentItem>)
    })

    const sortedDepartmentList = computed(() => {
        return [...list].sort((a, b) => a.title.localeCompare(b.title))
    })

    const getTitleById = (id: string | number): string => {
        const key = Number(id)
        return departmentsMap.value[key]?.title || ""
    }

    const getIdByType = (type: DepartmentType): number | null => {
        return list.find(item => item.type === type)?.id || null
    }

    return {
        options: sortedDepartmentList,
        departmentsMap,
        getTitleById,
        getIdByType,
    }
})
