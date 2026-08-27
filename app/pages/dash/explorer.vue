<template>
    <div class="p-2 h-full">
        <FileExplorer />
    </div>
</template>

<script lang="ts" setup>
const tny = useTNY360();

const controlLoopEnabled = ref(false);
const controlLoopLoading = ref(false);
const decisionLoopEnabled = ref(false);
const decisionLoopLoading = ref(false);

let shouldFetchInfos = false;

async function onControlLoopToggle() {
    controlLoopLoading.value = true;
    try {
        await tny.value?.system.setControlLoopEnabled(!controlLoopEnabled.value);
        controlLoopEnabled.value = !controlLoopEnabled.value;
    } catch (error) {
        console.error('Error toggling control loop:', error);
    }
    controlLoopLoading.value = false;
}

async function onDecisionLoopToggle() {
    decisionLoopLoading.value = true;
    try {
        await tny.value?.system.setDecisionLoopEnabled(!decisionLoopEnabled.value);
        decisionLoopEnabled.value = !decisionLoopEnabled.value;
    } catch (error) {
        console.error('Error toggling decision loop:', error);
    }
    decisionLoopLoading.value = false;
}

async function fetchLoopStates() {
    controlLoopLoading.value = true;
    decisionLoopLoading.value = true;
    try {
        const controlState = await tny.value?.system.getControlLoopEnabled();
        if (controlState !== undefined) {
            controlLoopEnabled.value = controlState;
        }
        controlLoopLoading.value = false;
    } catch (error) {
        console.error('Error fetching control loop state:', error);
    }
    try {
        const decisionState = await tny.value?.system.getDecisionLoopEnabled();
        if (decisionState !== undefined) {
            decisionLoopEnabled.value = decisionState;
        }
        decisionLoopLoading.value = false;
    } catch (error) {
        console.error('Error fetching decision loop state:', error);
    }
}

const adcVoltages = ref<number[][]>(Array.from({ length: 16 }, () => []));
async function fetchADCChannels() {
    console.log('fetching adc')
    try {
        const values = await tny.value?.adc.getAllChannels();
        for (let i = 0; i < 16; i++) {
            adcVoltages.value[i]?.push(values?.[i] || 0);
            if (adcVoltages.value[i]!.length > 20) {
                adcVoltages.value[i]?.shift();
            }
        }
    } catch (error) {
        if ((error as Error).message.toLowerCase().includes('timed out')) {
            // robot is overloaded, wait a bit
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.warn('Timed out while fetching ADC channels, retrying...');
        } else {
            console.error('Error fetching ADC channels:', error);
        }
    }
    if (shouldFetchInfos) setTimeout(fetchADCChannels, 1);
}

onMounted(() => {
    shouldFetchInfos = true;
    fetchADCChannels();
    fetchLoopStates();
});

onUnmounted(() => {
    shouldFetchInfos = false;
});

</script>

<style></style>