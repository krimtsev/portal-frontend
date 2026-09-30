import { computed } from "vue"
import { defineStore } from "pinia"
import { useI18n } from "vue-i18n"
import { type DepartmentItem, DepartmentType } from "@/definitions/departments"
import { Partner } from "@/definitions/partner"
import { useAppStore } from "@s/app/app"

export const useDepartmentStore = defineStore("departments", () => {
    const { t } = useI18n()
    const appStore = useAppStore()

    const rawDepartments = [
        { id: 1, type: DepartmentType.Franchise },
        { id: 2, type: DepartmentType.Build },
        { id: 3, type: DepartmentType.Marketing },
        { id: 4, type: DepartmentType.NetworkAdmin },
        { id: 5, type: DepartmentType.NetworkBarbering, allowed: [Partner.Britva] },
        { id: 6, type: DepartmentType.Community },
        { id: 7, type: DepartmentType.OfficeManager },
        { id: 8, type: DepartmentType.ItDepartment },
        { id: 9, type: DepartmentType.Accounting },
        { id: 10, type: DepartmentType.NetworkNail, allowed: [Partner.Soda] },
        { id: 11, type: DepartmentType.MakeupArtist, allowed: [Partner.Soda] },
        { id: 12, type: DepartmentType.Stylist, allowed: [Partner.Soda] },
    ]

    const departments = computed<DepartmentItem[]>(() => {
        return rawDepartments
            .filter(item => !item.allowed || item.allowed.includes(appStore.currentPartner))
            .map(({ id, type }) => ({
                id,
                type,
                title: t(`mc.department.${type}`),
            }))
    })

    const departmentsMap = computed(() => {
        return departments.value.reduce((acc, item) => {
            acc[item.id] = item
            return acc
        }, {} as Record<number, DepartmentItem>)
    })

    const sortedDepartmentList = computed(() => {
        return [...departments.value].sort((a, b) => a.title.localeCompare(b.title))
    })

    const getTitleById = (id: string | number): string => {
        const key = Number(id)
        return departmentsMap.value[key]?.title || ""
    }

    const getIdByType = (type: DepartmentType): number | null => {
        return departments.value.find(item => item.type === type)?.id || null
    }

    return {
        options: sortedDepartmentList,
        departmentsMap,
        getTitleById,
        getIdByType,
    }
})
