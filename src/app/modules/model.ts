import { ProcessState, ProcessStateStyle } from ".";

export const PROCESS_STATES_MAP: {[keys in ProcessState]: ProcessStateStyle} = {
    wip: {
        backgroundColor: "var(--color-wip)",
        color: "white",
        label: "WIP",
    },
    hold: {
        backgroundColor: "var(--color-hold)",
        color: "white",
        label: "HOLD",
    },
    ok: {
        backgroundColor: "var(--color-ok)",
        color: "white",
        label: "OK",
    },
    nok: {
        backgroundColor: "var(--color-nok)",
        color: "white",
        label: "NOK",
    }
}

