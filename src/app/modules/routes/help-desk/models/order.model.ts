
import { StationConfiguration } from "../../../station-configuration";

/** Los estados posibles de una Expedicion. */
export enum ExpeditionState {
    RECEPCIONADO = 1,
    PENDIENTE_RECEPCION = 2,
}

export interface Order {
    canal: string;
    devoCompleta: string;
    devoReserva: boolean;
    devolucionPendiente: string;
    devolucionTotal: string;
    devolucionesParciales: string;
    fecha: string;
    idPedido: string;
    idTerminal: number;
    idTransaccion: number;
    importeDevuelto: string;
    importeTotal: string;
    sucursal: number;
    tipoNegociado: string;
    tipoOperacion: string;
    //terminal: number;
    items: Item[];
    legajo: string;
    nepluticket: boolean;
    flag2: number;
    error: error;

    dni: string;
    cuit: string;
    cft: number;
    tea: number;
    cuotas: number;
    percepciones: boolean;
}

/* export interface OrderDetail {
    canal: string;
    dess: string;
    devoCompleta: string;
    error: error;
    flag2: number;
    idPedido: string;
    items: Item[];
    legajo: string;
    nepluticket: boolean;
    operacionSeleccionada: string;
    orden: string;
    pluss: string;
    pres: string;
    sucursal: number;
    idTerminal: number;
    idTransaccion: number;

    dni: string;
    cuit: string;
    cft: number;
    tea: number;
    cuotas: number;
    percepciones: boolean;
} */

export interface Item{
    EANs: string[];
    cantNegociada: number;
    cantidad: number;
    cantidadDevolver: number;
    cantidadDisponible: number;
    descripcion: string;
    devoluciones: Devolucion[]
    orden: string;
    pesable: string;
    plu: number;
    precio: string;
    subtotal: string;
    imagen?: string;
    esPluAjuste: boolean;
    negociados?: Item[];
}

export interface Devolucion {
    cantidad: number;
    fecha: string;
    orden: string;
    plu: number;
    subtotal: string;
    terminal: number;
    transaccion: number;
}

export interface error {
    CODIGO: number;
    MENSAJE: string;
}


export interface CustomCard {
    header: string;
    icon: string;
    value: string;
    color: string;
}

export interface OrderPayload {
    canal: string;
    devoCompleta: string;
    idPedido: string;
    legajo: string;
    sucursal: number;
    terminal: number;
    tieneDevolucion: boolean;
    transaccion: number;
    nepluticket: boolean;
}

/**
 * Filtros para el listado de reservas a preparar.
 */
 export interface OrderFilter {
    sucursal: string | null;
    nroPedido: string | null;
    transaccion: string | null;
    terminal: string | null;
    fechaTicket: string | null;
}

export type ActionName = "imprimir" | "cancelar" | "detalle";

/** La accion que se puede realizar del conteo */
export interface OrderAction {
    name: ActionName;
    title: string;
    icon: string;
    color?: string;
    availableStates: number[] | null;
    permission?: string;
}

/**
 * Una opción del tipo de entrega.
 */
 export interface statusTypeControl {
    value: ExpeditionState;
    displayValue: string;
}

export interface DevolucionRequest{
    idPedido:string;
    sucursal:number;
    canal:string;
    terminal:number;
    transaccion:number;
    totalDevolver:string;
    tipoNegociado:string;
    items: Item[];
    flag:number;
    esPluAjuste: boolean;
    dni:string;
}

export interface DevolucionResponse{
    error: error;
}

export interface PrintRequest{
    idPedido: string;
    sucursal: number;
    canal: string;
    devoparc: string;
    tipoNegociado: string;
    legajo: string;
    btnautorizar: boolean;
}

export interface PrintResponse{
    idPedido:string;
    sucursal:number;
    canal:string;
    totalDevolver:string;
    items: Item[];
    codebar: string;
    error: error;
    TipoNegociado:string;
    autorizado: boolean;
    pluBonificado: boolean;
    legajo: string;
    existeAutorizacion: boolean;
}


export interface GetPedidoRequest{
    sucursal: number;
    idPedido: string;
    terminal: number;
    transaccion: number;
    canal: string;
    tieneDevolucion: boolean;
    devoCompleta: string;
    tipoNegociado: string;
    nepluticket: boolean;
    legajo: string;
}

export interface GetPedidoResponse{
    error: error;
    idPedido: string;
    sucursal: number;
    canal: string;
    terminal: number;
    transaccion: number;
    items: Item[];
    devoCompleta: string;
    pluss: string;
    dess: string;
    pres: string;
    operacionSeleccionada: string;
    flag2: number;
    nepluticket: boolean;
    orden: string;
    devoReserva: boolean
    legajo: string;
}




export const EXPEDITION_STATES_MAP: {[keys in ExpeditionState]: string} = {
    1: 'RECEPCIONADO',
    2: 'PENDIENTE',
}

export interface ForceUser {
    solic_wf: string;
    pallet_wf: string;
    ubicacion: string | null;
    usuario: string;
    hostname: string | null;
}

export interface ExpeditionResolvedData {
    stationConfiguration: StationConfiguration | null;
}

export interface Series {
    cantidad: number;
    control?: string;
    disposicion?: string;
    enbaled: number;
    fecha_creacion: string;
    grupo?: string;
    id_pallet: string;
    id_serie: string;
    id_serie_proveedor?: string;
    observacion?: string;
    plu: string;
    proceso: string;
    proceso_estado: string;
    sububicacion: string;
    ubicacion: string;
}
