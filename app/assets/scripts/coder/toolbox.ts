export default {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: "category",
            name: "Event",
            id: "EVENT",
            categorystyle: "event_category",
            contents: [
                {
                    kind: "block",
                    type: "event_setup"
                },
                {
                    kind: "block",
                    type: "event_loop"
                }
            ],
        },
        {
            kind: "category",
            name: "Controls",
            id: "CONTROLS",
            categorystyle: "controls_category",
            contents: [
                {
                    kind: "block",
                    type: "controls_if"
                },
                {
                    kind: "block",
                    type: "controls_ifelse"
                },
                {
                    kind: "block",
                    type: "controls_repeat_ext"
                },
                {
                    kind: "block",
                    type: "controls_whileUntil"
                },
                {
                    kind: "block",
                    type: "controls_for"
                },
                {
                    kind: "block",
                    type: "controls_flow_statements"
                },
                {
                    kind: "block",
                    type: "controls_waitSeconds"
                },
                {
                    kind: "block",
                    type: "controls_stop"
                },
                {
                    kind: "block",
                    type: "logic_compare"
                },
                {
                    kind: "block",
                    type: "logic_operation"
                },
                {
                    kind: "block",
                    type: "logic_negate"
                },
                {
                    kind: "block",
                    type: "logic_boolean"
                },
                {
                    kind: "block",
                    type: "logic_null"
                },
                {
                    kind: "block",
                    type: "logic_ternary"
                }
            ],
        },
        {
            kind: "category",
            name: "Math",
            id: "MATH",
            categorystyle: "math_category",
            contents: [
                {
                    kind: "block",
                    type: "math_number"
                },
                {
                    kind: "block",
                    type: "math_arithmetic"
                },
                {
                    kind: "block",
                    type: "math_compare"
                },
                {
                    kind: "block",
                    type: "math_single"
                },
                {
                    kind: "block",
                    type: "math_trig"
                },
                {
                    kind: "block",
                    type: "math_constant"
                },
                {
                    kind: "block",
                    type: "math_time"
                },
                {
                    kind: "block",
                    type: "math_number_property"
                },
                {
                    kind: "block",
                    type: "math_round"
                },
                {
                    kind: "block",
                    type: "math_on_list"
                },
                {
                    kind: "block",
                    type: "math_modulo"
                },
                {
                    kind: "block",
                    type: "math_constrain"
                },
                {
                    kind: "block",
                    type: "math_random_int"
                },
                {
                    kind: "block",
                    type: "math_random_float"
                },
                {
                    kind: "block",
                    type: "math_atan2"
                },
            ],
        },
        {
            kind: "category",
            name: "Text",
            id: "TEXT",
            categorystyle: "text_category",
            contents: [
                {
                    kind: "block",
                    type: "text"
                },
                {
                    kind: "block",
                    type: "text_join"
                },
                {
                    kind: "block",
                    type: "text_length"
                },
                {
                    kind: "block",
                    type: "text_isEmpty"
                },
                {
                    kind: "block",
                    type: "text_print"
                },
                {
                    kind: "block",
                    type: "text_say"
                }
            ],
        },
        {
            kind: "category",
            name: "List",
            id: "LIST",
            categorystyle: "list_category",
            contents: [
                {
                    kind: "block",
                    type: "lists_create_with"
                },
                {
                    kind: "block",
                    type: "lists_create_with"
                },
                {
                    kind: "block",
                    type: "lists_repeat"
                },
                {
                    kind: "block",
                    type: "lists_length"
                },
                {
                    kind: "block",
                    type: "lists_isEmpty"
                },
                {
                    kind: "block",
                    type: "lists_indexOf"
                },
                {
                    kind: "block",
                    type: "lists_getIndex"
                },
                {
                    kind: "block",
                    type: "lists_setIndex"
                },
                {
                    kind: "block",
                    type: "lists_getSublist"
                },
                {
                    kind: "block",
                    type: "lists_split"
                },
                {
                    kind: "block",
                    type: "lists_sort"
                },
                {
                    kind: "block",
                    type: "lists_reverse"
                }
            ],
        },
        {
            kind: "category",
            name: "Variable",
            id: "VARIABLE",
            categorystyle: "variable_category",
            custom: "VARIABLE"
        },
        {
            kind: "category",
            name: "Procedure",
            id: "PROCEDURE",
            categorystyle: "procedure_category",
            custom: "PROCEDURE"
        },
        {
            kind: "SEP"
        },
        {
            kind: "category",
            name: "Movement",
            id: "MOVEMENT",
            categorystyle: "movement_category",
            contents: [
                {
                    kind: "block",
                    type: "movement_enable"
                },
                {
                    kind: "block",
                    type: "movement_disable"
                },
                {
                    kind: "block",
                    type: "movement_forward_at"
                },
                {
                    kind: "block",
                    type: "movement_sideways_at"
                },
                {
                    kind: "block",
                    type: "movement_turn_at"
                },
                {
                    kind: "block",
                    type: "movement_forward_by"
                },
                {
                    kind: "block",
                    type: "movement_sideways_by"
                },
                {
                    kind: "block",
                    type: "movement_turn_by"
                },
                {
                    kind: "block",
                    type: "movement_stop"
                },
                {
                    kind: "block",
                    type: "movement_body_position"
                },
                {
                    kind: "block",
                    type: "movement_body_orientation"
                },
                {
                    kind: "block",
                    type: "movement_body_position_orientation"
                },
            ],
        },
    ]
};