import { Injectable } from '@angular/core';
import { iif, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeout, catchError, switchMap, tap } from 'rxjs/operators';
import { StationConfigurationService } from '../modules/station-configuration/services/configuration.service';
import { StationConfiguration } from '../modules/station-configuration';

export interface PrinterPayload {
    label: string;
    printer?: number;
}

@Injectable()
export class SerialService {

    constructor(
        private http: HttpClient,
        private stationConfigurationService: StationConfigurationService,
    ) {}

    printZPL(zplCode: string, printer: number = -1): Observable<any> {
        let payload: PrinterPayload = {
            label: zplCode,
            printer: printer,
        }
        let config_: StationConfiguration | null = null;

        return this.stationConfigurationService.getStationConfig().pipe(
            tap(config => {
                config_ = config;

                if (payload.printer == -1) {
                    payload.printer = <number>config.printers[0]?.position ?? 0;
                }
            }),
            switchMap(config => iif(() => config_?.hostname != null,

                this.http.post(`${environment.serialApiUrl}print`, payload).pipe(
                    tap(som => {
                        console.log(zplCode);
                    }),
                    timeout(1000),
                ),

                throwError(new HttpErrorResponse({error: { descripcion: 'hola'}, status: 511})),
            )),
        );
    }
}
