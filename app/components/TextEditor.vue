<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex space-x-2 items-center py-1 px-2 bg-slate-200 dark:bg-slate-900">
            <p> {{ filename }} </p>
            <div class="flex w-full justify-end">
                <UButton variant="ghost" color="neutral" icon="lucide:x" @click="() => { emit('close') }" />
            </div>
        </div>
        <div class="flex grow w-full max-h-full min-h-0 h-full">
            <Codemirror
                :model-value="textModelValue"
                :extensions="extensions"
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="4"
                @update:model-value="onModelValueUpdate"
                style="display: flex; flex-grow: 1; height: 100%; width: 100%;"
            />
        </div>
        <div ref="saveBar" class="overflow-hidden w-full transition-all min-h-0 h-fit" style="max-height: 0px; height: 0px; min-height: 0px;">
            <div class="flex items-center justify-end bg-slate-200 dark:bg-slate-900 p-2 min-h-fit w-full">
                <UButton variant="solid" color="primary" @click="onSaveClicked" :loading="saveLoading"> Save </UButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { python } from '@codemirror/lang-python';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror'

const modelValue = defineModel<string>();
const props = defineProps<{
    filename: string;
    saveLoading?: boolean;
}>();
const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', value: string): void;
}>();

const fileExtension = computed(() => {
    const parts = props.filename.split('.');
    if (parts.length < 2) return undefined;
    return parts[parts.length - 1];
});

const extensions = computed(() => {
    const exts = [oneDark]
    if (fileExtension.value === 'py') exts.push(python());
    if (fileExtension.value === 'json') exts.push(json());
    return exts
});

const textModelValue = ref<string>();
function onModelValueUpdate(value: string) {
    textModelValue.value = value;
}

const saveBar = ref<HTMLElement|null>();
const hasContentChanged = computed(() => {
    if (modelValue.value === undefined || textModelValue.value === undefined) return false;
    return modelValue.value?.replace(/\r\n/g, '\n') !== textModelValue.value?.replace(/\r\n/g, '\n');
});
watch(hasContentChanged, (newVal) => {
    if (!saveBar.value) return;
    const height = saveBar.value.firstElementChild?.getBoundingClientRect().height;
    if (newVal) {
        saveBar.value.style.maxHeight = height + 'px';
        saveBar.value.style.height = height + 'px';
        saveBar.value.style.minHeight = height + 'px';
    } else {
        saveBar.value.style.maxHeight = '0px';
        saveBar.value.style.height = '0px';
        saveBar.value.style.minHeight = '0px';
    }
});

function onSaveClicked() {
    emit('save', textModelValue.value ?? '');
}

onMounted(() => {
    textModelValue.value = modelValue.value;
});
watch(modelValue, (newVal) => {
    textModelValue.value = newVal;
});
</script>

<style>
.cm-editor {
    background-color: transparent;
    font-family: 'Consolas', monospace;
    font-size: 16px;
}
.cm-focused {
    outline: none !important;
}

@media (prefers-color-scheme: light) {
    .cm-activeLineGutter {
        background-color: #e2e8f0 !important;
    }
    .cm-gutters {
        background-color: #f8fafc !important;
    }
}
@media (prefers-color-scheme: dark) {
    .cm-activeLineGutter {
        background-color: #0f172a !important;
    }
    .cm-gutters {
        background-color: #1e293b !important;
    }
}
</style>