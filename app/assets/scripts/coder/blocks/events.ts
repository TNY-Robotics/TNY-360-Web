export default [
    {
        name: "event_setup",
        block: {
            type: "event_setup",
            tooltip: "",
            helpUrl: "",
            message0: "Setup %1 %2",
            args0: [
                { type: "input_dummy" },
                {
                    type: "input_statement",
                    name: "insts"
                }
            ],
            style: "event_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const statements_insts = javascript.statementToCode(block, 'insts');
            return `window.blockly_setup = async () => {\n${statements_insts}}\n`;
        }
    },
    {
        name: "event_loop",
        block: {
            type: "event_loop",
            tooltip: "",
            helpUrl: "",
            message0: "Loop %1 %2",
            args0: [
                { type: "input_dummy" },
                {
                    type: "input_statement",
                    name: "insts"
                }
            ],
            style: "event_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const statements_insts = javascript.statementToCode(block, 'insts');
            return `window.blockly_loop = async () => {\n${statements_insts}}\n`;
        }
    },
];