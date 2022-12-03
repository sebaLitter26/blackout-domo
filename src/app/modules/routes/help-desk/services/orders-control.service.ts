import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { Order, OrderFilter, DevolucionRequest, DevolucionResponse, PrintRequest, PrintResponse, OrderPayload, GetPedidoRequest, Item } from "../models/order.model";
import { environment } from "src/environments/environment";
import { SEARCH } from "../../model";
import { PluUtils } from "../../../../utils/plu.utils";
import { ProfileService } from "../../../main/services/profile.service";
import { StationConfigurationService } from "../../../station-configuration/services/configuration.service";
import { StationConfiguration } from '../../../station-configuration';


/** Filtros por defecto a usar en `getOrders`. */
const DEFAULT_EXPEDITION_FILTERS: OrderFilter = {
    sucursal: null,
    nroPedido: null,
    transaccion: null,
    terminal: null,
    fechaTicket: null,
}

@Injectable()
export class OrdersControlService {

    constructor(
        private http: HttpClient,
        private profileService: ProfileService,
        private stationConfigurationService: StationConfigurationService,
    ) {}

    /**
     * Obtiene el listado de pallets para su control de serialización.
     * @returns un `Observable` con el listado de pallets
     */
    getOrders(filters: OrderFilter = DEFAULT_EXPEDITION_FILTERS): Observable<Order[]> {
        return this.http.post<Order[]>(`${environment.apiUrlTicket}${SEARCH}/pedidos`, filters);
    }

    
    /**
     * Obtiene el detalle de un conteo
     * @return un observable con el detalle de un conteo
     */
    getOrderDetails(order: OrderPayload): Observable<Order> {
        return this.http.post<Order>(`${environment.apiUrlTicket}pedido/get`, order)
        .pipe(
            tap((data: Order) => {
                data.idTerminal = order.terminal;
                data.idTransaccion = order.transaccion;
                data.legajo = order.legajo;

                data.items = (data.items == null) ? [] : data.items.map(item => {
                    return {...item, 
                        imagen : PluUtils.buildPluImageUrl(''+item.plu),
                        precio : item.precio.replace(',','.'),
                        subtotal : item.subtotal.replace(',','.'),
                        cantNegociada : Number(item.cantNegociada.toFixed(2))
                    };
                });

                /*
                if(data.items == null){ 
                    return [];
                } else {
                    const uniquePlus = new Set();
                    const unique = data.items.filter(element => {
                        const isDuplicate = uniquePlus.has(element.plu);
                        uniquePlus.add(element.plu);
                      
                        if (!isDuplicate) {
                            element.imagen = PluUtils.buildPluImageUrl(''+element.plu);
                            element.precio = element.precio.replace(',','.');
                            element.subtotal = element.subtotal.replace(',','.');
                            element.cantNegociada = Number(element.cantNegociada.toFixed(2));
                           /*  const orderHistory = data.items.filter(elem=> elem.plu == element.plu);  
                            if(!element.negociados)
                                element.negociados = orderHistory; // (orderHistory.length>1) ? orderHistory : [];      
                            return true;
                        }
                            
                        return false;
                    });
                    return uniquePlus;
                     return data.items.sort((a: Item, b: Item) => { 
                        a.precio = a.precio.replace(',','.');
                        a.subtotal = a.subtotal.replace(',','.');
                        (a.negociados?.push) ? a.negociados.push(a) : a.negociados = [];
                        return b.plu - a.plu;
                    }) 
                    
                }
                */
            })
        );
    }

    /* groupBy = (list: Item[], key: string) => {
        return list.reduce((prev, curr) => {
            return {
                ...prev,
                [curr[key]]: [
                    ...(prev[key] || []),
                    curr, 
                ]
            }    
        }, {})
    } */

    realizarDevolucion(payload:DevolucionRequest):Observable<DevolucionResponse>{
        return this.http.post<DevolucionResponse>(`${environment.apiUrlTicket}pedido/devolver`, payload);     
    }

    eliminaDP(payload: PrintRequest):Observable<PrintResponse>  {
        return this.http.post<PrintResponse>(`${environment.apiUrlTicket}pedido/eliminardp`, payload);     
    }

    getArticulo(articulo:GetPedidoRequest):Observable<Order>  {
        return this.http.post<Order>(`${environment.apiUrlTicket}pedido/getarticulos`, articulo);     
    }

    getPrintData(payload: PrintRequest):Observable<PrintResponse>{
        return this.http.post<PrintResponse>(`${environment.apiUrlTicket}pedido/print`, payload);    
      }

    /* reservationsForced(data: Order): Observable<any> {
        const forceData: ForceUser = {
            solic_wf: data?.canal,
            pallet_wf: data?.devoCompleta,
            ubicacion: null,
            usuario: this.profileService.user.legajo,
            hostname: null,
        }

        return this.stationConfigurationService.getStationConfig().pipe(
            tap((stationConfig: StationConfiguration) => {
                forceData.hostname = stationConfig.hostname;
                forceData.ubicacion = stationConfig.ubication;
            }),
            switchMap((stationConfig: StationConfiguration) => this.http.post<Order[]>(`${environment.apiUrl}${RESOURCE_WAREFLOW}/ForzarPalletWf`, forceData)),
        );
    } */

    

}