import { javascriptGenerator } from "blockly/javascript";

let blockly_instance: any = null;
export async function getBlockly() {
    if (!blockly_instance) {
        blockly_instance = await import("blockly");
    }
    return blockly_instance as typeof import("blockly");
}

export const isRunning = ref(false);
export const isStepping = ref(false);
export const isPaused = ref(false);
export const currentInstruction = ref(null as any);

const pendingStepResolve = ref(null as any);

// For registering code only
let allow_all_execution = false;

const currentCode = ref("");
export async function compileCode() {
    const Blockly = await getBlockly();
    const workspace = Blockly.getMainWorkspace();
    
    javascriptGenerator.STATEMENT_PREFIX = 'await onBlockStart(%1);\n';
    javascriptGenerator.STATEMENT_SUFFIX = 'await onBlockEnd(%1);\n';
    javascriptGenerator.addReservedWords('onBlockStart');
    javascriptGenerator.addReservedWords('onBlockEnd');
    const code = javascriptGenerator.workspaceToCode(workspace)
        .replaceAll('\nfunction', '\nasync function'); // make all functions async
    currentCode.value = `window.registerBlocklyCode = async () => {\n\n${code}\n\n};`;

    try { eval(currentCode.value); }
    catch (e) { console.error('Error evaluating code', e); }

    try {
        allow_all_execution = true;
        await (window as any).registerBlocklyCode();
        allow_all_execution = false;
    } catch (e) { console.error('Error registering code', e); }

    if (typeof (window as any).blockly_setup !== 'function') {
        console.warn("No blockly_setup function found, please add a setup event.");
    }

    if (typeof (window as any).blockly_loop !== 'function') {
        console.warn("No blockly_loop function found, please add a loop event.");
    }
}

export async function resetExecution() {
    const Blockly = await getBlockly();
    const workspace = Blockly.getMainWorkspace();
    (workspace as any).highlightBlock(null);
}

export async function runCode() {
    if (!(window as any).blockly_setup) {
        console.error("No blockly_setup function found, please add a setup event.");
        return;
    }
    if (!(window as any).blockly_loop) {
        console.error("No blockly_loop function found, please add a loop event.");
        return;
    }

    // Run setup code first
    try {
        await (window as any).blockly_setup();
    } catch (e) {
        console.error("Error running setup code", e);
        return;
    }

    if (!isRunning.value) {
        resetExecution();
        return;
    }

    // Then run loop code
    const run_loop_code = async () => {
        try {
            await (window as any).blockly_loop();
        } catch (e) {
            console.error("Error running loop code", e);
            return;
        }
        if (isRunning.value) {
            setTimeout(run_loop_code, 0);
        }
    };
    run_loop_code();
}

export async function stepCode() {
    return new Promise<void>(async (resolve) => {
        if (pendingStepResolve.value) {
            isPaused.value = false;
            await pendingStepResolve.value();
            pendingStepResolve.value = null;

            // now, wait until instruction is finished
            const checkFinished = () => {
                const isFinished = pendingStepResolve.value !== null || !isRunning.value || !isStepping.value;
                if (isFinished) resolve();
                else setTimeout(checkFinished, 10);
            };
            checkFinished();
        }
    });
}

// Called when block ended execution, returns true if we should continue (false to stop execution)
async function onBlockEnd(id: string) {
    if (allow_all_execution) return true;

    const Blockly = await getBlockly();
    const workspace = Blockly.getMainWorkspace();
    (workspace as any).highlightBlock(null);

    currentInstruction.value = null;
}

async function onBlockStart(id: string) {
    return new Promise<void>((resolve) => {
        if (allow_all_execution) {
            resolve();
            return;
        }
        if (!isRunning.value) {
            resetExecution();
            return;
        }

        const nextLogic = async () => {
            const Blockly = await getBlockly();
            const workspace = Blockly.getMainWorkspace() as any;
            workspace.highlightBlock(id);

            currentInstruction.value = id;
            resolve();
        }

        if (isStepping.value || isPaused.value) {
            isPaused.value = true;
            pendingStepResolve.value = nextLogic;
        }
        else nextLogic();
    });
}

export function registerBlocklyListeners() {
    (window as any).onBlockStart = onBlockStart;
    (window as any).onBlockEnd = onBlockEnd;
    (window as any).onStop = () => {
        isRunning.value = false;
        isStepping.value = false;
        isPaused.value = false;
        resetExecution();
    };
}

export function unregisterBlocklyListeners() {
    (window as any).onBlockStart = undefined;
    (window as any).onBlockEnd = undefined;
    (window as any).onStop = undefined;
}