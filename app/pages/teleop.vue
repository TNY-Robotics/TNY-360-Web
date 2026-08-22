<template>
    <div class="relative min-h-screen min-w-screen max-w-screen max-h-screen w-screen h-screen overflow-hidden">
        <!-- CAMERA FEED -->
        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black dark:bg-black">
            <img
                class="w-full h-full object-cover" 
                :src="streamUrl ?? ''"
            />
        </div>

        <!-- BACK BUTTON -->
        <UButton class="absolute top-4 left-4" variant="ghost" color="neutral" @click="goBack" icon="lucide:arrow-left" />

        <!-- SETTINGS BUTTON -->
        <UButton class="absolute top-4 right-4" variant="ghost" color="neutral" @click="showSettingsPanel" icon="lucide:settings" />

        <!-- TOP STATUS BAR -->
        <div class="absolute top-2 right-0 left-0 h-fit flex justify-center items-center pointer-events-none">
            <div class="w-fit h-fit bg-slate-200/30 dark:bg-slate-800/70 border border-white/50 dark:border-slate-800 rounded-lg shadow-lg px-2 py-1">
                <p class="text-sm text-slate-900 dark:text-slate-50"> Latency: <code class="bg-white/50 dark:bg-slate-950/50 px-1 rounded-sm">{{ Math.round(tny?.latency ?? 0) }} ms</code> </p>
            </div>
        </div>

        <!-- SETTINGS PANEL -->
        <div ref="settingsPanel" class="absolute right-0 top-0 h-full w-fit p-2 transition-all z-50" style="transform: translateX(100%);">
            <div class="bg-slate-800 rounded-lg p-2 border-2 border-slate-700 min-h-full space-y-8">
                <!-- CLOSE BUTTON -->
                <UButton class="absolute top-4 right-4" variant="ghost" color="neutral" @click="hideSettingsPanel" icon="lucide:x" />

                <h3 class="pr-16"> Settings </h3>
                <div class="space-y-4">
                    <!-- Gait type -->
                    <div class="space-y-2">
                        <h4 class="text-sm"> Gait Type </h4>
                        <div class="flex space-x-2">
                            <USelect class="min-w-48" :items="gaitTypes" v-model="gaitConfig.type" @change="onConfigModified" />
                        </div>
                    </div>
                    <!-- Gait frequency -->
                    <div class="space-y-2">
                        <h4 class="text-sm"> Gait Frequency (Hz) </h4>
                        <div class="flex space-x-2">
                            <USlider class="min-w-48" :min="0.1" :max="3.0" :step="0.1" v-model="gaitConfig.frequency" @change="onConfigModified" />
                            <p class="text-sm w-12 text-right px-1 py-0.5 bg-slate-900 rounded-sm"> {{ gaitConfig.frequency.toFixed(1) }} </p>
                        </div>
                    </div>
                    <!-- Gait duty factor -->
                    <div class="space-y-2">
                        <h4 class="text-sm"> Gait Duty Factor </h4>
                        <div class="flex space-x-2">
                            <USlider class="min-w-48" :min="0.1" :max="0.9" :step="0.1" v-model="gaitConfig.dutyFactor" @change="onConfigModified" />
                            <p class="text-sm w-12 text-right px-1 py-0.5 bg-slate-900 rounded-sm"> {{ gaitConfig.dutyFactor.toFixed(1) }} </p>
                        </div>
                    </div>
                    <!-- Gait step height -->
                    <div class="space-y-2">
                        <h4 class="text-sm"> Gait Step Height </h4>
                        <div class="flex space-x-2">
                            <USlider class="min-w-48" :min="0.01" :max="0.1" :step="0.01" v-model="gaitConfig.stepHeight" @change="onConfigModified" />
                            <p class="text-sm w-12 text-right px-1 py-0.5 bg-slate-900 rounded-sm"> {{ gaitConfig.stepHeight.toFixed(2) }} </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- LEFT JOYSTICK : MOVE X, Y -->
        <TeleopJoystick class="absolute bottom-0 left-0 w-64 h-64" v-model="joyLeft" />
        <!-- RIGHT JOYSTICK : ROTATE Z + LOOK UP/DOWN -->
        <TeleopJoystick class="absolute bottom-0 right-0 w-64 h-64" v-model="joyRight" />
    </div>
</template>

<script lang="ts" setup>
import type { SelectItem } from '@nuxt/ui';
import { GaitType } from '@tny-robotics/sdk';

const router = useRouter();

const tny = useTNY360();
const tnyAddr = ref<string | null>(null);

const streamUrl = computed(() => {
    return tny.value?.ip ? `${window.location.protocol}//${tny.value.ip}:90?t=${Date.now()}` : null;
});

watch(tny, (newVal) => {
    if (!tny.value) return;
    tnyAddr.value = tny.value.ip;
});

const joyLeft = ref({
    x: 0,
    y: 0
});
const joyRight = ref({
    x: 0,
    y: 0
});

function goBack() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
    }
    router.replace('/');
}

let shouldSendCommands = false;
async function sendCommandsContinuous() {
    try {
        await tny.value?.body.setVelocity(-joyLeft.value.y*0.45, -joyLeft.value.x*0.45, -joyRight.value.x*2.8, false);
    } catch (err) { await new Promise((resolve) => setTimeout(resolve, 1000)); }
    if (shouldSendCommands) setTimeout(sendCommandsContinuous, 50);
}

async function enableRobot() {
    try {
        const enabledFlag = await tny.value?.body.getEnabled();
        if (enabledFlag === undefined) throw new Error('Failed to get enabled flag');
        if (((enabledFlag as number) & 0b111111111111) <= 0)
        {
            const time = await tny.value?.body.enableSmooth();
            if (!time) throw new Error('Failed to run smooth enable');
            await new Promise((resolve) => setTimeout(resolve, time * 1000));
        }
    } catch (err) {
        console.error(err);
    }
}

async function disableRobot() {
    try {
        const enabledFlag = await tny.value?.body.getEnabled();
        if (enabledFlag === undefined) throw new Error('Failed to get enabled flag');
        if (((enabledFlag as number) & 0b111111111111) > 0)
        {
            const time = await tny.value?.body.disableSmooth();
            if (!time) throw new Error('Failed to run smooth disable');
            await new Promise((resolve) => setTimeout(resolve, time * 1000));
        }
    } catch (err) {
        console.error(err);
    }
}


const settingsPanel = ref<HTMLElement | null>(null);
function showSettingsPanel() {
    if (!settingsPanel.value) return;
    settingsPanel.value.style.transform = 'translateX(0%)';
}
function hideSettingsPanel() {
    if (!settingsPanel.value) return;
    settingsPanel.value.style.transform = 'translateX(100%)';
}

const gaitTypes = ref<SelectItem[]>([
    { label: 'Creep', value: GaitType.Creep },
    { label: 'Walk', value: GaitType.Walk },
    { label: 'Run', value: GaitType.Run },
    { label: 'Jump', value: GaitType.Jump }
]);
const gaitConfig = reactive({
    type: GaitType.Walk,
    frequency: 2.0,
    dutyFactor: 0.6,
    stepHeight: 0.02
});

async function fetchGaitConfig() {
    if (!tny.value) return;
    gaitConfig.type = await tny.value.gait.getType() ?? GaitType.Walk;
    gaitConfig.frequency = await tny.value.gait.getFrequency() ?? 2.0;
    gaitConfig.dutyFactor = await tny.value.gait.getDutyFactor() ?? 0.6;
    gaitConfig.stepHeight = await tny.value.gait.getStepHeight() ?? 0.02;
    console.groupEnd();
}

let sendModifTimeout: any = null;
function onConfigModified() {
    if (sendModifTimeout) clearTimeout(sendModifTimeout);
    sendModifTimeout = setTimeout(sendGaitConfig, 500);
}

async function sendGaitConfig() {
    if (!tny.value) return;
    await tny.value.gait.setType(gaitConfig.type, true);
    await tny.value.gait.setFrequency(gaitConfig.frequency, true);
    await tny.value.gait.setDutyFactor(gaitConfig.dutyFactor, true);
    await tny.value.gait.setStepHeight(gaitConfig.stepHeight, true);
    console.groupEnd();
} 

onMounted(() => {
    // request fullscreen on page load
    if (document.fullscreenEnabled && !window.location.href.includes('localhost')) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    }
    // also fix rotation on mobile devices
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch((err) => {
            console.error(`Error attempting to lock screen orientation: ${err.message} (${err.name})`);
        });
    }

    // listen when the user exits fullscreen, this means he wants to go back to the home page
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            router.replace('/');
        }
    });

    enableRobot();

    fetchGaitConfig();

    shouldSendCommands = true;
    sendCommandsContinuous();
});

onUnmounted(() => {
    shouldSendCommands = false;

    disableRobot();
});

</script>

<style>
.backdrop-blur {
    backdrop-filter: blur(16px);
}
</style>