<template>
    <blockquote class="b-blockquote">
        <slot />
    </blockquote>
</template>

<style scoped lang="scss">
.b-blockquote {
    border-left: 4px solid var(--p-divider-border-color);
    margin: 0 0 1em 0;
    padding: 0.5em 0 0.5em 2em;
}
</style>
