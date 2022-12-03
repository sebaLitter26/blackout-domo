export type StationArea = "desarrollo"

/**
 * La configuración actual de la estación de trabajo.
 */
export interface StationConfiguration {
    process: StationArea | null;
    hostname: string | null;
    printers: PrinterDevice[];
    ubication: string | null;
    subUbication: SubUbication | null;
}

export interface PrinterDevice {
	labelType: number;
	position: number | null;
}

export interface SubUbication {
	origen: string;
	destino: string;
}

/**
 * Una opción dentro de una lista de opciones.
 * Tiene un valor literal y un valor semántico para mostrarse al usuario en la interfaz.
 */
export interface ListOption {
    value: number;
    displayValue: string;
}

export interface SerialResponse {
    data: any;
}