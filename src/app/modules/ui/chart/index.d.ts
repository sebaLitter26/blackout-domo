import { Chart, ChartEvent, ChartType, TimeUnit } from 'chart.js';

/** Estructura de las etiquets del grafico. */
export interface Info {
    label: string;
    data: any[] | number[];
    tension?: number;
    backgroundColor?: string;
    borderColor?: string;
    pointBackgroundColor?: string;
    pointBorderColor?: string; 
}

export type Period = "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year";

//export interface DataScale { x: number, y: number}

export interface ChartInfo {
    labels: string[];   // Etiquetas del grafico.
    data: Info[];       //Informacion del grafico.
    type: string;       // El tipo de grafico. Ex: doughnut - bar - line - bubble - scatter
    title: string;      // Titulo del Grafico.
    period: TimeUnit;     // Periodo del Grafico.
}
