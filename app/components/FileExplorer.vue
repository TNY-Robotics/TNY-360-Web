<template>
    <div class="flex flex-col w-full h-full space-y-2">
        <div class="flex space-x-2 bg-slate-200 dark:bg-slate-900 p-2 rounded-lg w-full">
            <div class="overflow-auto w-full">
                <div class="flex space-x-2 items-center w-fit h-fit">
                    <UButton variant="ghost" color="neutral" icon="lucide:chevron-right" @click="() => { path = [] }" />
                    <div v-for="(part, index) in path" :key="index" class="flex space-x-2 items-center">
                        <p class="text-lg font-bold"> {{ part }} </p>
                        <UButton v-if="index < path.length - 1" variant="ghost" color="neutral" icon="lucide:chevron-right" @click="() => { path = path.slice(0, index + 1) }" />
                    </div>
                </div>
            </div>
            <UButton variant="ghost" color="neutral" icon="lucide:refresh-ccw" @click="fetchDirFiles" />
        </div>
        <div class="flex lg:flex-row flex-col grow w-full h-full overflow-hidden">
            <UContextMenu :items="backgroundMenuItems" class="h-full min-h-0 max-h-full">
                <div class="w-full h-full border border-slate-300 dark:border-slate-900 rounded-lg p-2 overflow-auto">
                    <div class="flex flex-wrap h-fit w-full gap-4">
                        <UContextMenu v-for="file in files" :key="file.name" :items="fileMenuItems(file)">
                            <button
                                class="flex flex-col justify-center items-center space-y-2 bg-slate-200/30 dark:bg-slate-700/30 border-2 border-slate-200/30 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg p-2 w-32 h-32"
                                @click="() => { fileMenuItems(file)![0]!.find((item: any) => item.label?.trim().toLowerCase() === 'open')!.onClick(); }">
                                <div class="p-2 w-full h-full">
                                    <UIcon :name="file.type === 'file' ? 'lucide:file' : 'lucide:folder'" class="w-full h-full" />
                                </div>
                                <UTooltip :text="file.name" placement="top">
                                    <p class="whitespace-nowrap text-ellipsis min-w-0 max-w-full overflow-hidden min-h-fit h-8"> {{ file.name }} </p>
                                </UTooltip>
                            </button>
                        </UContextMenu>
                    </div>
                </div>
            </UContextMenu>
            <div v-if="fileOpen !== undefined" class="mt-2 lg:mt-0 lg:ml-2 w-full h-full border border-slate-300 dark:border-slate-900 rounded-lg overflow-hidden">
                <TextEditor v-if="fileType === 'text' && fileOpen" :filename="fileOpen" v-model="fileContentText"
                    @close="() => { fileOpen = undefined; fileContent = undefined; fileContentText = ''; }"
                    @save="onTextEditorSave"
                    :saveLoading="textEditorSaveLoading"
                />
            </div>
        </div>
    </div>
    <UModal v-model:open="newFolderModalOpen" title="New Folder" :closeable="true">
        <template #body>
            <div class="flex flex-col space-y-2">
                <p> Folder name: </p>
                <UInput v-model="newFolderName" placeholder="New Folder Name" />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full space-x-2">
                <UButton variant="link" color="neutral" @click="() => { newFolderModalOpen = false }"> Cancel </UButton>
                <UButton variant="solid" color="primary" :loading="newFolderButtonLoading" @click="createNewFolder"> Create </UButton>
            </div>
        </template>
    </UModal>
    <UModal v-model:open="renameModalOpen" title="Rename" :closeable="true">
        <template #body>
            <div class="flex flex-col space-y-2">
                <p> New name: </p>
                <UInput v-model="newName" placeholder="New Name" />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full space-x-2">
                <UButton variant="link" color="neutral" @click="() => { renameModalOpen = false }"> Cancel </UButton>
                <UButton variant="solid" color="primary" :loading="renameButtonLoading" @click="renameFile"> Create </UButton>
            </div>
        </template>
    </UModal>
    <UModal v-model:open="newFileModalOpen" title="New File" :closeable="true">
        <template #body>
            <div class="flex flex-col space-y-2">
                <p> File name: </p>
                <UInput v-model="newName" placeholder="New File Name" />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full space-x-2">
                <UButton variant="link" color="neutral" @click="() => { newFileModalOpen = false }"> Cancel </UButton>
                <UButton variant="solid" color="primary" :loading="newFileButtonLoading" @click="createNewFile"> Create </UButton>
            </div>
        </template>
    </UModal>
</template>

<script lang="ts" setup>
import type { ContextMenuItem } from '@nuxt/ui';

const userdata = useUserdata();
const path = ref<string[]>([]);

// Fullpath in format "path/to/directory/"
const currentPath = computed(() => {
    const fullPath = path.value.join('/');
    const res = fullPath.endsWith('/') ? fullPath : fullPath + '/';
    return res === '/' ? '' : res;
});

const files = ref<FileInfo[]|undefined|null>(undefined);

async function fetchDirFiles() {
    fileOpen.value = undefined;
    fileContent.value = undefined;
    files.value = undefined;
    try {
        const res = await userdata.listDir(currentPath.value);
        files.value = res;
    } catch (err) {
        console.error(err);
        files.value = null;
    }
}

const newFolderModalOpen = ref(false);
const newFolderName = ref('');
const newFolderButtonLoading = ref(false);
async function createNewFolder() {
    if (!newFolderName.value || newFolderName.value.trim() === '')
    {
        return;
    }
    newFolderButtonLoading.value = true;
    try {
        await userdata.createFolder(currentPath.value, newFolderName.value.trim());
        newFolderModalOpen.value = false;
        newFolderName.value = '';
        fetchDirFiles();
    } catch (err) {
        console.error(err);
    } finally {
        newFolderButtonLoading.value = false;
    }
}

const renameModalOpen = ref(false);
const oldName = ref('');
const newName = ref('');
const renameButtonLoading = ref(false);
async function renameFile() {
    if (!newName.value || newName.value.trim() === '')
    {
        return;
    }
    renameButtonLoading.value = true;
    try {
        await userdata.renameFile(currentPath.value+oldName.value, currentPath.value+newName.value.trim());
        renameModalOpen.value = false;
        newName.value = '';
        fetchDirFiles();
    } catch (err) {
        console.error(err);
    } finally {
        renameButtonLoading.value = false;
    }
}

const newFileModalOpen = ref(false);
const newFileButtonLoading = ref(false);
async function createNewFile() {
    if (!newName.value || newName.value.trim() === '')
    {
        return;
    }
    newFileButtonLoading.value = true;
    try {
        await userdata.writeFile(currentPath.value+newName.value.trim(), new Blob([], { type: 'text/plain' }));
        newFileModalOpen.value = false;
        newName.value = '';
        fetchDirFiles();
    } catch (err) {
        console.error(err);
    } finally {
        newFileButtonLoading.value = false;
    }
}

const backgroundMenuItems = ref<ContextMenuItem[][]>([[
    {
        label: 'New File',
        icon: 'lucide:file-plus',
        onClick: () => {
            newFileModalOpen.value = true;
        },
    },
    {
        label: 'New Folder',
        icon: 'lucide:folder-plus',
        onClick: () => {
            newFolderModalOpen.value = true;
        },
    },
    {
        label: 'Upload File',
        icon: 'lucide:upload',
        onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = async (e: any) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    await userdata.writeFile(currentPath.value+file.name, file);
                    fetchDirFiles();
                } catch (err) {
                    console.error(err);
                }
            };
            input.click();
        },
    },
    {
        label: 'Refresh',
        icon: 'lucide:refresh-ccw',
        onClick: () => {
            fetchDirFiles();
        },
    }
]]);

const fileOpen = ref<string|undefined>(undefined);
const fileContent = ref<Blob|undefined>(undefined);
const fileType = computed(() => {
    if (!fileContent.value) return undefined;
    const type = fileContent.value.type;
    if (type.startsWith('text/')) return 'text';
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type === 'application/json') return 'text';
    return 'binary';
});
const fileContentText = ref<string>('');
const textEditorSaveLoading = ref(false);
async function onTextEditorSave(newContent: string) {
    if (!fileOpen.value) return;
    textEditorSaveLoading.value = true;
    try {
        const blob = new Blob([newContent], { type: 'text/plain' });
        await userdata.writeFile(currentPath.value+fileOpen.value, blob);
        fileContent.value = blob;
    } catch (err) {
        console.error(err);
    } finally {
        textEditorSaveLoading.value = false;
    }
}

watch(fileContent, async (newVal) => {
    if (!newVal) return;
    if (fileType.value === 'text') {
        const text = await newVal.text();
        fileContentText.value = text;
    }
});

const fileMenuItems = (file: FileInfo): ContextMenuItem[][] => {
    return [[
        {
            label: 'Open',
            icon: 'lucide:folder-open',
            onClick: async () => {
                if (file.type === 'directory') {
                    path.value.push(file.name);
                    await fetchDirFiles();
                } else {
                    fileOpen.value = file.name;
                    try {
                        const content = await userdata.readFile(currentPath.value+file.name);
                        fileContent.value = content;
                    } catch (err) {
                        console.error(err);
                    }
                }
            },
        },
        {
            label: 'Download',
            icon: 'lucide:download',
            disabled: file.type === 'directory',
            onClick: async () => {
                try {
                    const blob = await userdata.readFile(currentPath.value+file.name);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (err) {
                    console.error(err);
                }
            },
        },
        {
            label: 'Rename',
            icon: 'lucide:edit-2',
            onClick: async () => {
                oldName.value = file.name;
                newName.value = file.name;
                renameModalOpen.value = true;
            },
        },
        {
            label: 'Delete',
            icon: 'lucide:trash-2',
            onClick: async () => {
                try {
                    if (file.type === 'file') await userdata.deleteFile(currentPath.value, file.name);
                    else await userdata.deleteFolder(currentPath.value, file.name);
                    await fetchDirFiles();
                } catch (err) {
                    console.error(err);
                }
            },
        },
    ]];
};

onMounted(() => {
    fetchDirFiles();
});

watch(path, (newPath) => {
    fetchDirFiles();
});

</script>

<style></style>