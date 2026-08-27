<template>
    <div class="flex flex-col min-h-dvh min-w-full max-w-full max-h-dvh w-full h-dvh overflow-hidden p-4 lg:p-8">
        <p class="text-center show-up text-6xl font-extrabold"> TNY-360 </p>
        <p class="text-center show-up text-lg text-gray-600 dark:text-gray-300"> Welcome to the TNY-360 Web Interface!</p>
        <div class="flex grow justify-center items-center">
            <div class="grid grid-cols-2 grid-rows-2 gap-8 h-fit w-full justify-center items-center">
                <BigButton class="show-up delay-200" href="/teleop" label="Play with my TNY-360" icon="lucide:gamepad-2" />
                <BigButton class="show-up delay-400" href="/animator" label="Animate my TNY-360" icon="lucide:play" disabled color="neutral" />
                <BigButton class="show-up delay-600" href="/coder" label="Program my TNY-360" icon="lucide:square-terminal" />
                <BigButton class="show-up delay-800" href="/dash" label="View Control Panel" icon="lucide:gauge" />
            </div>
        </div>
        <div class="flex w-full justify-between">
            <UButton variant="soft" label="Diagnostic Mode" icon="lucide:wrench" @click="onDiagModeClicked" />
        </div>
    </div>
    <UModal v-model:open="calibrationPopupOpen" title="Not Calibrated">
        <template #body>
            <div class="space-y-4">
                <div class="space-y-1">
                    <p> We detected that your robot is not yet calibrated. </p>
                    <p> Without calibration, your TNY-360 won't have position feedback, automatic misalignment correction, and may not walk and move properly. </p>
                </div>
                <p> Do you want to calibrate your robot now? </p>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full space-x-4">
                <UButton variant="link" color="neutral" label="Skip" icon="lucide:x" @click="() => { calibrationPopupOpen = false }" />
                <UButton variant="solid" color="primary" label="Calibrate" icon="lucide:arrow-right" trailing href="/calibration" />
            </div>
        </template>
    </UModal>
    <UModal v-model:open="diagnosticPopupOpen" title="Diagnostic Mode">
        <template #body>
            <div class="space-y-4">
                <div class="space-y-1">
                    <p> Your robot will need to reboot into diagnostic mode before you can start the diagnostic. </p>
                </div>
                <p> Do you want to reboot into diagnostic mode? </p>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full space-x-4">
                <UButton variant="link" color="neutral" label="Cancel" @click="() => { diagnosticPopupOpen = false }" />
                <UButton variant="solid" color="primary" label="Reboot" icon="lucide:arrow-right" trailing @click="onDiagModeReboot" :loading="diagModeBtnLoading" />
            </div>
        </template>
    </UModal>
    <UModal v-model:open="errorsPopupOpen" title="Errors Detected">
        <template #body>
            <div class="space-y-4">
                <div class="space-y-1">
                    <p> Your robot seems to have reported errors. </p>
                </div>
                <p> Do you want to take a look at them? </p>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full space-x-4">
                <UButton variant="link" color="neutral" label="No" @click="closeErrorsPopup" />
                <UButton variant="solid" color="primary" label="View Errors" icon="lucide:arrow-right" trailing @click="goToErrors" :loading="errorsBtnLoading" />
            </div>
        </template>
    </UModal>
</template>

<script lang="ts" setup>
import type { TNY360 } from '@tny-robotics/sdk';
import { MotorCalibrationState, MotorId } from '@tny-robotics/sdk';

const robot = useTNY360();
const router = useRouter();

const calibrationPopupOpen = ref(false);

async function checkForDiagnosticMode(tny: TNY360) {
    const diagEnabled = await tny.diagnostic.isEnabled();
    if (diagEnabled) {
        router.replace('diagnostic');
        return true;
    }
    return false;
}

async function checkForCalibration(tny: TNY360) {
    const promises = Array.from({ length: 12 }, (_, i) => tny.motor.getCalibrationState(i as MotorId));
    const calibStates = await Promise.all(promises);
    const hasUncalibrated = calibStates.some(state => state !== MotorCalibrationState.Calibrated);
    console.groupEnd();
    if (hasUncalibrated) {
        calibrationPopupOpen.value = true;
        return true;
    }
    return false;
}

async function checkForErrors(tny: TNY360) {
    return new Promise<boolean>(async (resolve) => {
        const nb_errors = await tny.error.getErrorCount();
        console.groupEnd();
        if (nb_errors > 0) {
            errorsPopupOpen.value = true;
            errorsPopupClosedCallback = () => {
                resolve(false);
            };
            return;
        }
        resolve(false);
    });
}

watch(robot, async (tny) => {
    if (!tny) return;
    tny.on('connected', async () => {
        if (await checkForErrors(tny)) return;
        if (await checkForDiagnosticMode(tny)) return;
        if (await checkForCalibration(tny)) return;
    });
}, { immediate: true });

const diagnosticPopupOpen = ref(false);
const diagModeBtnLoading = ref(false);
function onDiagModeClicked() {
    diagnosticPopupOpen.value = true;
    diagModeBtnLoading.value = false;
}

async function onDiagModeReboot() {
    diagModeBtnLoading.value = true;
    robot.value?.diagnostic.rebootInDiagnosticMode();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    diagnosticPopupOpen.value = false;
    window.close();
}

const errorsPopupOpen = ref(false);
const errorsBtnLoading = ref(false);
let errorsPopupClosedCallback: any = null;
function goToErrors() {
    errorsBtnLoading.value = true;
    router.push('errors');
}
function closeErrorsPopup() {
    errorsPopupOpen.value = false;
    if (errorsPopupClosedCallback !== null) {
        errorsPopupClosedCallback();
        errorsPopupClosedCallback = null;
    }
}

onMounted(async () => {
    if (!robot.value) return;
    if (await checkForErrors(robot.value)) return;
    if (await checkForDiagnosticMode(robot.value)) return;
    if (await checkForCalibration(robot.value)) return;
});

</script>

<style></style>