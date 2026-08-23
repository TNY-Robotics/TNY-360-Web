import { Order } from "blockly/javascript";
import events from "./blocks/events"
import movement from "./blocks/movement"
import TYPE from "./types";

export default [
    ...events,
    ...movement,
].concat([
    // WaitSeconds block
    {
        name: "controls_waitSeconds",
        block: {
            type: 'controls_waitSeconds',
            message0: 'Wait %1 seconds',
            args0: [
                {
                    type: "input_value",
                    name: "time",
                    check: TYPE.NUMBER
                }
            ],
            previousStatement: null,
            nextStatement: null,
            style: "controls_blocks",
            tooltip: "",
            helpUrl: ""
        } as any,
        generator: (javascript: any) => function(block: any) {
            var time = javascript.valueToCode(block, 'time', Order.NONE);
            return `await new Promise(resolve => setTimeout(resolve, ${time} * 1000));\n`;
        }
    },
    // Stop block
    {
        name: "controls_stop",
        block: {
            type: 'controls_stop',
            message0: 'Stop',
            previousStatement: null,
            style: "controls_blocks",
            tooltip: "",
            helpUrl: ""
        } as any,
        generator: (javascript: any) => function(block: any) {
            return `return window.onStop();\n`;
        }
    },
    // TextSay block
    {
        name: "text_say",
        block: {
            type: 'text_say',
            message0: 'Say %1',
            args0: [
                {
                    type: "input_value",
                    name: "text",
                    check: TYPE.STRING
                }
            ],
            previousStatement: null,
            nextStatement: null,
            style: "text_blocks",
            tooltip: "",
            helpUrl: ""
        } as any,
        generator: (javascript: any) => function(block: any) {
            var text = javascript.valueToCode(block, 'text', Order.NONE);
            return `console.log(${text});\n`;
        }
    },
    // Math.Time block
    {
        name: "math_time",
        block: {
            type: 'math_time',
            message0: 'Time in seconds %1',
            args0: [ { type: "input_dummy" } ],
            output: TYPE.NUMBER,
            style: "math_blocks",
            tooltip: "",
            helpUrl: ""
        } as any,
        generator: (javascript: any) => function(block: any) {
            return [`(Date.now() / 1000)`, Order.ATOMIC];
        }
    },
    // Math.Compare block
    {
        name: "math_compare",
        block: {
            type: 'math_compare',
            message0: '%1 %2 %3',
            args0: [
                {
                    type: "input_value",
                    name: "A",
                    check: TYPE.NUMBER
                },
                {
                    type: "field_dropdown",
                    name: "OP",
                    options: [
                        ["=", "EQ"],
                        ["≠", "NEQ"],
                        ["<", "LT"],
                        [">", "GT"],
                        ["≤", "LTE"],
                        ["≥", "GTE"]
                    ]
                },
                {
                    type: "input_value",
                    name: "B",
                    check: TYPE.NUMBER
                }
            ],
            output: TYPE.BOOLEAN,
            style: "math_blocks",
            tooltip: "",
            helpUrl: ""
        } as any,
        generator: (javascript: any) => function(block: any) {
            var argument0 = javascript.valueToCode(block, 'A', Order.NONE);
            var argument1 = javascript.valueToCode(block, 'B', Order.NONE);
            var operator = block.getFieldValue('OP');
            var code;
            switch (operator) {
                case 'EQ': code = `${argument0} === ${argument1}`; break;
                case 'NEQ': code = `${argument0} !== ${argument1}`; break;
                case 'LT': code = `${argument0} < ${argument1}`; break;
                case 'GT': code = `${argument0} > ${argument1}`; break;
                case 'LTE': code = `${argument0} <= ${argument1}`; break;
                case 'GTE': code = `${argument0} >= ${argument1}`; break;
            }
            return [code, Order.NONE];
        }
    },
] as any[]);