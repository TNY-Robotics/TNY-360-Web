<template>
    <div class="p-2 w-full h-fit">
        <div class="flex items-center space-x-4 bg-slate-900 rounded-lg px-4 py-3">
            <UButton variant="link" color="neutral" size="xl" icon="lucide:arrow-left" @click="() => { $router.back() }" />
            <h1 class=""> TNY-Coder </h1>
            <USeparator orientation="vertical" size="lg" class="h-6 px-4" />
            <div class="flex justify-center items-start gap-4">
                <UDropdownMenu :items="itemsFile" :content="{align: 'start', side: 'bottom', sideOffset: 8}" :ui="{content: 'w-48'}">
                    <UButton variant="soft" label="File" color="neutral" icon="lucide:file-text" />
                </UDropdownMenu>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'
import { exportWorkspaceJSON, importWorkspaceJSON, loadDefaultWorkspace } from '~/assets/scripts/coder.main';

const itemsFile = ref<DropdownMenuItem[]>([
    { label: 'New', icon: 'lucide:file-plus', onSelect: onNewPressed },
    { label: 'Load', icon: 'lucide:folder-open', onSelect: onLoadPressed },
    { label: 'Save', icon: 'lucide:save', onSelect: onSavePressed }
]);

async function onNewPressed() {
    await loadDefaultWorkspace();
}

async function onLoadPressed() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            const reader = new FileReader();
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                const jsonData = e.target?.result as string;
                importWorkspaceJSON(JSON.parse(jsonData));
            };
            reader.readAsText(file as any);
        }
    };
    fileInput.click();
}

async function onSavePressed() {
    const jsonData = await exportWorkspaceJSON();
    if (jsonData) {
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

</script>

<style></style>