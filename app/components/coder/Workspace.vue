<template>
    <div class="flex grow p-2 pt-0 w-full h-full">
        <div class="bg-slate-800 border border-slate-900 rounded-lg h-full w-full overflow-hidden">
            <div class="absolute bottom-7 right-7 w-fit h-fit space-x-4 p-2 rounded-xl bg-slate-900" style="z-index: 10">
                <UTooltip text="Stop" v-if="isRunning || isPaused || isStepping" class="show-right">
                    <UButton icon="lucide:square" size="md" variant="solid" color="error" @click="onStopPressed" />
                </UTooltip>
                <UTooltip text="Step" v-if="isPaused || !isRunning || isStepping" class="show-right">
                    <UButton icon="lucide:redo" size="md" variant="solid" color="info" @click="onStepPressed" :disabled="btnDisabled.step" :loading="btnLoading.step" />
                </UTooltip>
                <UTooltip text="Pause" v-if="isRunning && !isPaused && !isStepping">
                    <UButton icon="lucide:pause" size="md" variant="solid" color="warning" @click="onPausePressed" :disabled="btnDisabled.pause" :loading="btnLoading.pause" />
                </UTooltip>
                <UTooltip text="Run" v-if="!isRunning || isStepping || isPaused">
                    <UButton icon="lucide:play" size="md" variant="solid" color="success" @click="onRunPressed" :disabled="btnDisabled.run" :loading="btnLoading.run" />
                </UTooltip>
            </div>
            <CoderBlocklyZone />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { isRunning, isStepping, isPaused, registerBlocklyListeners, unregisterBlocklyListeners, runCode, compileCode, resetExecution, stepCode } from '~/assets/scripts/coder/script';

const btnDisabled = reactive({
    stop: false,
    step: false,
    pause: false,
    run: false
});
const btnLoading = reactive({
    stop: false,
    step: false,
    pause: false,
    run: false
});

function disableAllButtons() {
    btnDisabled.stop = true;
    btnDisabled.step = true;
    btnDisabled.pause = true;
    btnDisabled.run = true;
}
function enableAllButtons() {
    btnDisabled.stop = false;
    btnDisabled.step = false;
    btnDisabled.pause = false;
    btnDisabled.run = false;
}
function unloadAllButtons() {
    btnLoading.stop = false;
    btnLoading.step = false;
    btnLoading.pause = false;
    btnLoading.run = false;
}
function setButtonLoading(button: 'stop' | 'step' | 'pause' | 'run') {
    unloadAllButtons();
    btnLoading[button] = true;
}

async function onStepPressed() {
    disableAllButtons();
    setButtonLoading('step');
    
    isStepping.value = true;

    if (!isRunning.value) {
        await compileCode();
        isRunning.value = true;
        runCode(); // no await, we don't want disabled+loading until code is done running
    }
    
    if (isPaused.value) {
        await stepCode();
    }

    enableAllButtons();
    unloadAllButtons();
}

async function onRunPressed() {
    disableAllButtons();
    setButtonLoading('run');
    
    // If the code is already running (but in step mode), just switch to run mode
    if (isRunning.value && isPaused.value) {
        isStepping.value = false;
        isPaused.value = false;
        await stepCode(); // since isStepping is now false, it won't just step, it will run the rest of the code
        enableAllButtons();
        unloadAllButtons();
        return;
    }

    // Else, compile and run the code as normal

    await compileCode();

    isRunning.value = true;
    isStepping.value = false;
    isPaused.value = false;

    runCode(); // no await, we don't want disabled+loading until code is done running

    enableAllButtons();
    unloadAllButtons();
}

async function onStopPressed() {
    disableAllButtons();
    setButtonLoading('stop');

    await resetExecution();

    isRunning.value = false;
    isStepping.value = false;
    isPaused.value = false;

    enableAllButtons();
    unloadAllButtons();
}

async function onPausePressed() {
    disableAllButtons();
    setButtonLoading('pause');

    isPaused.value = true;
    isStepping.value = false;
    isRunning.value = true;

    enableAllButtons();
    unloadAllButtons();
}

onMounted(() => {
    registerBlocklyListeners();
});

onBeforeUnmount(() => {
    unregisterBlocklyListeners();
});

</script>

<style></style>