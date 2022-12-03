import { Type } from "@angular/core";

export interface ProcessStep {
    iconSrc: string;
    processId: string;
    processStepId?: string;
    status: ProcessStatus;

    /** Label principal del Step. Es opcional.*/
    primaryLabel?: string;
    /** Label secundario del Step. Es opcional. */
    secondaryLabel?: string;
    /** Data a usarse a modo de detalle en panel dinámico. */
    processData?: any[];
    onClick?: (data: any) => {};
}

export type ProcessStatus = "VOID" | "WIP" | "OK" | "NOK";

export type ProcessStatusOrientation = "horizontal" | "vertical";

export type ProcessStatusLabelPosition = "before" | "after";

export interface PanelDataComponent {
    data: any;
}

export interface PanelDataDialogData {
    data: any;
    componentType: Type<PanelDataComponent>;
}
