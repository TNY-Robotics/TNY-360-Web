<template>
    <UButton class="flex flex-col justify-center items-center h-32 max-w-64" variant="subtle" :disabled="disabled" :color="color" :href="href">
        <UIcon :name="icon" class="w-8 h-8 mb-2" />
        <p class="text-base text-center">{{ label }}</p>
    </UButton>
</template>

<script lang="ts" setup>
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    color: {
        type: String as PropType<'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'>,
        default: 'primary'
    }
});
</script>

<style></style>