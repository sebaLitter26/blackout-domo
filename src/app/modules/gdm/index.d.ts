export interface GdmPlu {
    plu: string;
    descripcion: string;
    stock: number;
    unidadDePeso: string;
    peso: number;
    unidadDeVolumen: string;
    volumen: string;
    tipoDeElectro: string;
    tipoSerializable: string;
    poseeSerie: boolean;
    serializaProducto: boolean;
}

export type ElectroType = ""