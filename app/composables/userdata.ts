const robot = useTNY360();

export type FileInfo = {
    name: string;
    type: 'file' | 'directory';
}

function getIP() {
    return robot.value?.ip ?? window.location.hostname;
}

async function listDir(path: string) {
    const ip = getIP();
    const strPath = `http://${ip}/usrdta/${path}`;
    const response = await (await fetch(strPath+(strPath.endsWith('/') ? '' : '/'))).json();
    return response as FileInfo[];
}

async function readFile(path: string) {
    const ip = getIP();
    const strPath = `http://${ip}/usrdta/${path}`;
    const response = await (await fetch(strPath.endsWith('/') ? strPath.slice(0, -1) : strPath)).blob();
    return response;
}

async function writeFile(path: string, content: Blob) {
    const ip = getIP();
    const strPath = `http://${ip}/usrdta/${path}`;
    const response = await fetch(strPath.endsWith('/') ? strPath.slice(0, -1) : strPath, { method: 'POST', body: content });
    return response.ok;
}

async function deleteFile(path: string, name: string) {
    const ip = getIP();
    const strPath = `http://${ip}/usrdta/${path}${name.endsWith('/') ? name.slice(0, -1) : name}`;
    console.log(`deleteFile, path=${path}, name=${name}, strPath=${strPath}`);
    const response = await fetch(strPath.endsWith('/') ? strPath.slice(0, -1) : strPath, { method: 'DELETE' });
    return response.ok;
}

async function renameFile(oldPath: string, newPath: string) {
    const ip = getIP();
    const strPath = `http://${ip}/usrdta/${oldPath.endsWith('/') ? oldPath.slice(0, -1) : oldPath}?rename=${newPath.endsWith('/') ? newPath.slice(0, -1) : newPath}`;
    const response = await fetch(strPath, { method: 'PUT' });
    return response.ok;
}

async function createFolder(path: string, name: string) {
    const ip = getIP();
    const strPath = `http://${ip}/usrdta/${path}`;
    const response = await fetch(strPath, { method: 'POST', body: name });
    return response.ok;
}

export const useUserdata = () => {
    return {
        listDir,
        readFile,
        writeFile,
        deleteFile,
        renameFile,
        deleteFolder: deleteFile,
        createFolder,
    }
}
