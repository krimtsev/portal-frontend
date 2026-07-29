<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { dashboardPaths } from "@r/dashboard/path"
import SettingsCard from "@v/dashboard/settings/_settings/components/settings-card.vue"
import SettingsSection from "@v/dashboard/settings/_settings/components/settings-section.vue"

const { t } = useI18n()
</script>

<template>
    <div class="settings-view">
        <article>
            <settings-section :title="t('mc.dashboard.settings.page.basicSection')">
                <settings-card
                    :title="t('mc.dashboard.settings.maintenance.title')"
                    :announce="t('mc.dashboard.settings.maintenance.announce')"
                    icon-name="pi-wrench"
                    :path="dashboardPaths.DashboardMaintenance"
                />
            </settings-section>
        </article>
    </div>
</template>

<style scoped lang="scss">
.settings-view {
    article {
        .settings-section {
            margin-bottom: 32px;
        }

        :deep(.section-title) {
            @include h3;

            margin-bottom: $indent-x2;
        }

        :deep(.section-label) {
            @include p;

            margin-top: #{$indent-x1 * -1};
            margin-bottom: $indent-x2;
        }

        :deep(.section-cards) {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: $indent-x2;

            @media (max-width: 1200px) {
                grid-template-columns: repeat(2, 1fr);
            }

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        }
    }
}
</style>
