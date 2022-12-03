import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

export type CatalogName =   "Reportes" | "EstadosFaltantes" | "CalculoCheckout" | "CalculoProduccion" | "AreasProduccion" | "Canales" | "EtiquetasProduccion" |
                            "StockGDM" | "Eventos" | "HostFiltrado" | "TipoOperacionLogPLU" | "ServiciosExternos" | "AdelantoProduccion" | "ConfigSucursal" |
                            "CorreccionPeso" | "ValidadorEan13" | "ValidacionesProduccion" | "MapaDeEventos" | "ParametrosLogin" | "TimersFront";

/** Estructura de catálogo */
export interface Catalog {
    activo: string;
    catalogo: string;
    data: any[];
    descripcion: string;
}

export interface CatalogUpdate {
    activo: string;
    catalogo: string;
    data: any;
    descripcion: string;
    eliminar?: boolean,
}

/** Parámetro de catálogo de checkout */
export interface CatalogParameter {
    descripcion: string;
    parametro: string;
    valor: any;
}

@Injectable({
    providedIn: 'root'
})
export class CatalogService {

    constructor(
        private http: HttpClient,
    ) {
        localStorage.setItem("porcentajeCorreccionPeso", "0.05");
    }

    /**
     * Devuelve todos los catálogos
     * @deprecated
     * @see getCatalogList
     */
    getCatalogs(): Observable<Catalog[]> {
        return this.http.get<Catalog[]>(`${environment.apiUrlTicket}GetCatalogo`);
    }

    /**
     *
     * @returns devuelve todos los catálogos
     */
    getCatalogList(): Observable<Catalog[]> {
      return this.http.get<Catalog[]>(`${environment.apiUrlTicket}Operacion/ListarCatalogos`);
  }

    /**
     * Devuelve un catálogo en base al nombre
     * @param catalogName el nombre del catálogo
     */
    getCatalog(catalogName: CatalogName): Observable<Catalog> {
        // const cachedCatalog: Catalog = this.cacheService.getCatalog(catalogName);

        // if (cachedCatalog) {
        //     return of(cachedCatalog);
        // }

        return this.http.get<Catalog>(`${environment.apiUrlTicket}GetCatalogo/${catalogName}`)
        // .pipe(
        //     tap((catalog: Catalog) => {
        //         this.cacheService.setCatalog(catalogName, catalog);
        //     }),
        // );
    }

    /**
     * Devuelve el parámetro de un catálogo
     * @param catalogName el nombre del catálogo
     * @param parameterName el nombre del parámetro
     */
    getCatalogParameter(catalogName: CatalogName, parameterName: string): Observable<CatalogParameter> {
        return this.getCatalog(catalogName).pipe(
            map((catalog: Catalog) => catalog.data.filter((parameter: CatalogParameter) => parameter.parametro == parameterName)[0]),
        );
    }


    /**
     * Crea un nuevo catálogo
     * @param params los datos del nuevo catálogo
     */

    createCatalog(catalog: Catalog): Observable<any> {
      return this.http.post(`${environment.apiUrlTicket}Operacion/AltaCatalogo`, catalog);

    }

    /**
     * Se utiliza para actualizar/eliminar catálogos
     * @param catalogData Información del catálogo a actualizar/eliminar
     * @returns confirmación de operación
     */
    updateInfoCatalog(catalogData: CatalogUpdate): Observable<any> {
      return this.http.post(`${environment.apiUrlTicket}Operacion/ModificacionCatalogo`, catalogData);
    }



    /**
     * Actualiza un catálogo
     * @param catalogData la data a insertar en el catálogo
     * @deprecated
     * @see updateInfoCatalog
     */
    updateCatalog(catalogData: CatalogUpdate): Observable<any> {
        return this.http.put(`${environment.apiUrlTicket}actualizarCatalogo`, catalogData);
    }
}
