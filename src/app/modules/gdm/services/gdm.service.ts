import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { GdmPlu } from "..";

const RESOURCE_GDM: string = "GDM";

@Injectable()
export class GdmService {

    constructor(
        private http: HttpClient,
    ) {}

    /**
     * Obtiene información de un PLU de GDM.
     * @param plu el plu
     * @returns un `Observable` con la información del PLU
     */
    getPluInformation(plu: string): Observable<GdmPlu> {
        return this.http.get<GdmPlu[]>(`${environment.apiInterfaceUrl}${RESOURCE_GDM}/consultaPlu?plu=${plu}`).pipe(
            map(pluArray => {
                return pluArray[0];
            }));
    }

    /**
     * Actualiza los PLUs con la información de GDM.
     * @returns un `Observable` con la respuesta del servicio
     */
    updatePlus(): Observable<any> {
        return this.http.put(`${environment.apiInterfaceUrl}${RESOURCE_GDM}/actualizarPlus`, {});
    }
}