import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SerialResponse, StationConfiguration } from '..';
import { map, tap } from 'rxjs/operators';

const EMPTY_STATION: StationConfiguration = {
    process: null,
    hostname: null,
    printers: [],
    ubication: null,
    subUbication: null,
}

export enum LabelType {
    PRODUCT = 0,
    SERIAL = 1,
    PALLET = 2,
    PLATFORM = 3,
}
@Injectable({
    providedIn: 'root',
})
export class StationConfigurationService {

    environment = environment;

    constructor(
        private http: HttpClient,
    ) {}

    /**
     * Obtiene la configuración de la estación de producción
     */
    getStationConfig(): Observable<StationConfiguration> {
        return this.http.get<StationConfiguration>(`${environment.serialApiUrl}stationConfiguration`);
    }

    /**
     * Guarda la configuración de la estación de producción
     */
    saveStationConfig(stationConfig: StationConfiguration): Observable<any> {
        return this.http.post(`${environment.serialApiUrl}stationConfiguration`, stationConfig);
    }

    /**
     * Obtiene el número de impresora asignado a un tipo de etiqueta.
     * @param labelId el id de la etiqueta (ver `LABEL_TYPE`)
     * @returns un `Observable` con el número de impresora si existe una configurada para ese tipo de etiqueta, caso contrario devuelve `undefined`
     */
    getPrinterNumberForLabel(labelId: number): Observable<number | null | undefined> {
        return this.getStationConfig().pipe(
            map(config => {
                return config.printers.find(item => item.labelType == labelId)?.position;
            })
        );
    }

    /**
     * Devuelve el listado de puertos de impresoras Zebra conectadas al equipo.
     * @returns un `Observable` con el listado de puertos
     */
    getPrinters(): Observable<number[]> {
        // return of([3, 12]);
        return this.http.get<SerialResponse>(`${environment.serialApiUrl}printers`).pipe(map(response => response.data));
    }

}
