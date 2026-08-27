<template>
    <div class="flex flex-col min-h-dvh min-w-full max-w-full max-h-dvh w-full h-dvh p-2 space-y-2">
        <div class="flex py-2 px-4 bg-slate-900 rounded-lg w-full h-fit">
            <div class="flex justify-start items-center w-16 lg:w-fit">
                <UButton icon="lucide:arrow-left" size="xl" variant="ghost" color="neutral" @click="goBack" />
            </div>
            <h1 class="text-2xl font-black py-2 px-2 whitespace-nowrap"> Errors </h1>
        </div>
        <div class="flex grow h-full w-full max-w-2xl">
            <div class="flex flex-col overflow-auto w-full h-full">
                <div class="flex flex-col gap-2 h-fit w-full">
                    <ErrorEventCard v-for="error in errors" :key="error.eventId" :id="error.eventId" :code="error.code" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { TNY360, ErrorEvent } from '@tny-robotics/sdk';

const robot = useTNY360();
const router = useRouter();

const errors = ref<ErrorEvent[]|undefined>([]);
async function fetchErrors(tny: TNY360) {
    errors.value = undefined;
    const nb_errors = await tny.error.getErrorCount();
    errors.value = [];
    if (nb_errors > 0) {
        // get most recent error, ErrorEventCard will display linked events on its own
        const err = await tny.error.getErrorEventByIndex(0);
        if (err) {
            errors.value.push(err);
        }
    }
}

function goBack() {
    router.back();
}

onMounted(async () => {
    if (!robot.value) return;
    await fetchErrors(robot.value);
});

watch(robot, async (tny) => {
    if (!tny) return;
    tny.on('connected', async () => {
        await fetchErrors(tny);
    });
});
</script>

<style></style>