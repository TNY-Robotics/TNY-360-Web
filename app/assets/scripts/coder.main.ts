import toolbox from "./coder/toolbox";
import theme from "./coder/theme";
import type { ToastOptions, WorkspaceSvg } from "blockly";
import { getBlockly } from "./coder/script";

interface InitProps {
    promptCallback: (message: string, defaultValue: string, callback: (result: string|null) => void) => void;
    codeDiv: HTMLDivElement;
}

export async function initializeCoder(props: InitProps) {
    const Blockly = await getBlockly();
    const javascript = await import("blockly/javascript");
    Blockly.inject(props.codeDiv, {
        toolbox: toolbox,
        renderer: 'zelos',
        theme: Blockly.Theme.defineTheme('TNY', theme()),
        grid: {
            spacing: 40,
            length: 4,
            colour: '#475569',
            snap: true
        },
        move: {
            scrollbars: true,
            drag: true,
            wheel: false
        },
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.8,
            pinch: true
        },
        trashcan: false,
        sounds: false,
        horizontalLayout: isVerticalScreenMode(),
    });
    Blockly.Scrollbar.scrollbarThickness =  14;

    // Set custom popup for prompt callback
    Blockly.dialog.setPrompt(props.promptCallback);

    // Import custom blocks
    const customBlocks = await import("./coder/blocks");
    customBlocks.default.forEach((block: any) => {
        if (typeof(block.block) === "function") {
            // TODO : Maybe check if this is the right way to do this
            Blockly.Blocks[block.name] = block.block;
        } else {
            const def = Blockly.common.createBlockDefinitionsFromJsonArray([block.block]);
            Blockly.common.defineBlocks(def);
        }
        javascript.javascriptGenerator.forBlock[block.name] = block.generator(javascript.javascriptGenerator);
    });

    await loadDefaultWorkspace();

    return Blockly;
}

export async function loadDefaultWorkspace() {
    const Blockly = await getBlockly();
    Blockly.serialization.workspaces.load({
        blocks: {
            blocks: [{
                type: 'event_setup',
                deletable: false,
                x: 60,
                y: 60
            }, {
                type: 'event_loop',
                deletable: false,
                x: 540,
                y: 60
            }]
        }
    }, Blockly.getMainWorkspace());
}

export async function exportWorkspaceJSON() {
    const Blockly = await getBlockly();
    const workspace = Blockly.getMainWorkspace();
    const json = Blockly.serialization.workspaces.save(workspace);
    return json;
}

export async function importWorkspaceJSON(json: any) {
    const Blockly = await getBlockly();
    const workspace = Blockly.getMainWorkspace();
    Blockly.serialization.workspaces.load(json, workspace);
}

export async function deinitializeCoder() {
    const Blockly = await getBlockly();
    Blockly.getMainWorkspace().clear();
}

function isVerticalScreenMode() {
    const screenDimensions = window.screen;
    const screenWidth = screenDimensions.width;
    const screenHeight = screenDimensions.height;
    return screenHeight > screenWidth;
}