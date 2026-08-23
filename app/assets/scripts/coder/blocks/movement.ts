import TYPE from "../types";

export default [
    {
        name: "movement_enable",
        block: {
            type: "movement_enable",
            tooltip: "",
            helpUrl: "",
            message0: "Enable body %1",
            args0: [
                { type: "input_dummy" },
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            return `{ const time = await window.robot.value?.body.enableSmooth(true); await new Promise(resolve => setTimeout(resolve, time * 1000)); }\n`;
        }
    },
    {
        name: "movement_disable",
        block: {
            type: "movement_disable",
            tooltip: "",
            helpUrl: "",
            message0: "Disable body %1",
            args0: [
                { type: "input_dummy" },
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            return `{ const time = await window.robot.value?.body.disableSmooth(true); await new Promise(resolve => setTimeout(resolve, time * 1000)); }\n`;
        }
    },
    {
        name: "movement_forward_at",
        block: {
            type: "movement_forward_at",
            tooltip: "",
            helpUrl: "",
            message0: "Move forward at %1 meters per second",
            args0: [
                {
                    type: "input_value",
                    name: "distance",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const distance = javascript.valueToCode(block, 'distance', javascript.ORDER_NONE);
            return `{ const vel = await window.robot.value?.body.getTargetVelocity(); await window.robot.value?.body.setVelocity(${distance}, vel.y_ms, vel.z_rads, true); }\n`;
        }
    },
    {
        name: "movement_sideways_at",
        block: {
            type: "movement_sideways_at",
            tooltip: "",
            helpUrl: "",
            message0: "Move sideways at %1 meters per second",
            args0: [
                {
                    type: "input_value",
                    name: "distance",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const distance = javascript.valueToCode(block, 'distance', javascript.ORDER_NONE);
            return `{ const vel = await window.robot.value?.body.getTargetVelocity(); await window.robot.value?.body.setVelocity(vel.x_ms, ${distance}, vel.z_rads, true); }\n`;
        }
    },
    {
        name: "movement_turn_at",
        block: {
            type: "movement_turn_at",
            tooltip: "",
            helpUrl: "",
            message0: "Turn at %1 degrees per second",
            args0: [
                {
                    type: "input_value",
                    name: "angle",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const angle = javascript.valueToCode(block, 'angle', javascript.ORDER_NONE);
            const radians = `(${angle} * Math.PI / 180)`;
            return `{ const vel = await window.robot.value?.body.getTargetVelocity(); await window.robot.value?.body.setVelocity(vel.x_ms, vel.y_ms, ${radians}, true); }\n`;
        }
    },
    {
        name: "movement_forward_by",
        block: {
            type: "movement_forward_by",
            tooltip: "",
            helpUrl: "",
            message0: "Move forward by %1 meters",
            args0: [
                {
                    type: "input_value",
                    name: "distance",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const distance = javascript.valueToCode(block, 'distance', javascript.ORDER_NONE);
            const direction = distance > 0 ? 1 : -1;
            const speed = 0.3;
            const time = Math.abs(distance) / speed;
            const FUCKEDUP_FACTOR = 1.4;
            return `await window.robot.value?.body.setVelocity(${direction * speed}, 0, 0, true); await new Promise(resolve => setTimeout(resolve, ${time * FUCKEDUP_FACTOR} * 1000)); await window.robot.value?.body.setVelocity(0, 0, 0, true);\n`;
        }
    },
    {
        name: "movement_sideways_by",
        block: {
            type: "movement_sideways_by",
            tooltip: "",
            helpUrl: "",
            message0: "Move sideways by %1 meters",
            args0: [
                {
                    type: "input_value",
                    name: "distance",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const distance = javascript.valueToCode(block, 'distance', javascript.ORDER_NONE);
            const direction = distance > 0 ? 1 : -1;
            const speed = 0.3;
            const time = Math.abs(distance) / speed;
            const FUCKEDUP_FACTOR = 1.4; // TODO: fix this, the robot is not turning at the correct speed because gait code is crap
            return `await window.robot.value?.body.setVelocity(0, ${direction * speed}, 0, true); await new Promise(resolve => setTimeout(resolve, ${time * FUCKEDUP_FACTOR} * 1000)); await window.robot.value?.body.setVelocity(0, 0, 0, true);\n`;
        }
    },
    {
        name: "movement_turn_by",
        block: {
            type: "movement_turn_by",
            tooltip: "",
            helpUrl: "",
            message0: "Turn by %1 degrees",
            args0: [
                {
                    type: "input_value",
                    name: "angle",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const angle = javascript.valueToCode(block, 'angle', javascript.ORDER_NONE);
            const radians = angle * Math.PI / 180;
            const direction = radians > 0 ? 1 : -1;
            const speed = Math.PI / 2;
            const time = Math.abs(radians) / speed;
            const FUCKEDUP_FACTOR = 1.4; // TODO: fix this, the robot is not turning at the correct speed because gait code is crap
            return `await window.robot.value?.body.setVelocity(0, 0, ${direction * speed}, true); await new Promise(resolve => setTimeout(resolve, ${time * FUCKEDUP_FACTOR} * 1000)); await window.robot.value?.body.setVelocity(0, 0, 0, true);\n`;
        }
    },
    {
        name: "movement_stop",
        block: {
            type: "movement_stop",
            tooltip: "",
            helpUrl: "",
            message0: "Stop movement %1",
            args0: [
                { type: "input_dummy" },
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            return `await window.robot.value?.body.setVelocity(0, 0, 0, true);\n`;
        }
    },
    {
        name: "movement_body_position",
        block: {
            type: "movement_body_position",
            tooltip: "",
            helpUrl: "",
            message0: "Set body position to X %1 meters, Y %2 meters, Z %3 meters",
            args0: [
                {
                    type: "input_value",
                    name: "x",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "y",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "z",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const x = javascript.valueToCode(block, 'x', javascript.ORDER_NONE);
            const y = javascript.valueToCode(block, 'y', javascript.ORDER_NONE);
            const z = javascript.valueToCode(block, 'z', javascript.ORDER_NONE);
            return `{ const post = await window.robot.value?.body.getPosture(); await window.robot.value?.body.setPosture(${x}, ${y}, ${z}, post.rot_x_rad, post.rot_y_rad, post.rot_z_rad, true); }\n`;
        }
    },
    {
        name: "movement_body_orientation",
        block: {
            type: "movement_body_orientation",
            tooltip: "",
            helpUrl: "",
            message0: "Set body orientation to X %1 degrees, Y %2 degrees, Z %3 degrees",
            args0: [
                {
                    type: "input_value",
                    name: "x",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "y",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "z",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const x = javascript.valueToCode(block, 'x', javascript.ORDER_NONE);
            const y = javascript.valueToCode(block, 'y', javascript.ORDER_NONE);
            const z = javascript.valueToCode(block, 'z', javascript.ORDER_NONE);
            const x_rad = `((${x}) * Math.PI / 180)`;
            const y_rad = `((${y}) * Math.PI / 180)`;
            const z_rad = `((${z}) * Math.PI / 180)`;
            return `{ const post = await window.robot.value?.body.getPosture(); await window.robot.value?.body.setPosture(post.pos_x_m, post.pos_y_m, post.pos_z_m, ${x_rad}, ${y_rad}, ${z_rad}, true); }\n`;
        }
    },
    {
        name: "movement_body_position_orientation",
        block: {
            type: "movement_body_position_orientation",
            tooltip: "",
            helpUrl: "",
            message0: "Set body position and orientation to X %1 meters, Y %2 meters, Z %3 meters, Roll %4 degrees, Pitch %5 degrees, Yaw %6 degrees",
            args0: [
                {
                    type: "input_value",
                    name: "x_pos",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "y_pos",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "z_pos",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "x_rot",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "y_rot",
                    check: TYPE.NUMBER
                },
                {
                    type: "input_value",
                    name: "z_rot",
                    check: TYPE.NUMBER
                }
            ],
            nextStatement: null,
            previousStatement: null,
            style: "movement_blocks",
        } as any,
        generator: (javascript: any) => function(block: any) {
            const x_pos = javascript.valueToCode(block, 'x_pos', javascript.ORDER_NONE);
            const y_pos = javascript.valueToCode(block, 'y_pos', javascript.ORDER_NONE);
            const z_pos = javascript.valueToCode(block, 'z_pos', javascript.ORDER_NONE);
            const x_rot = javascript.valueToCode(block, 'x_rot', javascript.ORDER_NONE);
            const y_rot = javascript.valueToCode(block, 'y_rot', javascript.ORDER_NONE);
            const z_rot = javascript.valueToCode(block, 'z_rot', javascript.ORDER_NONE);
            const x_rad = `((await ${x_rot}) * Math.PI / 180)`;
            const y_rad = `((await ${y_rot}) * Math.PI / 180)`;
            const z_rad = `((await ${z_rot}) * Math.PI / 180)`;
            return `{ await window.robot.value?.body.setPosture(await ${x_pos}, await ${y_pos}, await ${z_pos}, ${x_rad}, ${y_rad}, ${z_rad}, true); }\n`;
        }
    },
];