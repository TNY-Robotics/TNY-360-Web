<template>
    <div class="w-full h-full">
        <div class="w-full h-full" ref="blocklyDiv" style="z-index: -1;" />
        <div v-if="blocklyLoading" class="absolute top-0 left-0 w-full h-full">
            Loading Blockly...
        </div>
    </div>
    <UModal v-model:open="promptModalOpen" title="Prompt">
        <template #body>
            <div class="space-y-4">
                <div class="space-y-1">
                    <p> {{ promptMessage }} </p>
                </div>
                <UInput v-model="promptResponse" />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full space-x-4">
                <UButton variant="link" color="neutral" label="Cancel" @click="onPromptCancel" />
                <UButton variant="solid" color="primary" label="Submit" icon="lucide:arrow-right" trailing @click="onPromptSubmit" />
            </div>
        </template>
    </UModal>
</template>

<script lang="ts" setup>
import { deinitializeCoder, initializeCoder } from '../../assets/scripts/coder.main';

const blocklyLoading = ref(true);

const promptModalOpen = ref(false);
const promptMessage = ref('');
const promptResponse = ref('');
let promptCallback: ((response: string|null) => void) | null = null;
function onPromptSubmit() {
    promptModalOpen.value = false;
    if (promptCallback) {
        promptCallback(promptResponse.value);
        promptCallback = null;
    }
}
function onPromptCancel() {
    promptModalOpen.value = false;
    if (promptCallback) {
        promptCallback(null);
        promptCallback = null;
    }
}

const blocklyDiv = ref<HTMLDivElement | null>(null);
onMounted(async () => {
    const Blockly = await initializeCoder({
        codeDiv: blocklyDiv.value as HTMLDivElement,
        promptCallback(message, defaultValue, callback) {
            promptMessage.value = message;
            promptResponse.value = defaultValue;
            promptCallback = callback;
            promptModalOpen.value = true;
        }
    });
    blocklyLoading.value = false;

    // expose TNY-360 API through window for Blockly blocks to use
    const robot = useTNY360();
    (window as any).robot = robot;
});

onBeforeUnmount(async () => {
    await deinitializeCoder();
    blocklyLoading.value = true;

    // Remove TNY-360 API from window
    (window as any).robot = undefined;
});

</script>

<style>
.blocklyMainBackground {
    stroke: none !important;
}

.blocklyFlyoutScrollbar {
    display: none !important;
}
</style>