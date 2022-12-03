import { Injectable, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { map, Observable, of } from "rxjs";
import { Order, OrderPayload } from "../models/order.model";
import { OrdersControlService } from "../services/orders-control.service";

/**
 * Es un resolver para precargar los Pedidos, se utiliza en el Operations module
 */
@Injectable()
export class OrderDetailResolver implements Resolve<Order> {

    constructor(
        private orderService: OrdersControlService,
        public router: Router,
    ) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {

        if(Object.keys(route.queryParams).length === 0) 
            this.router.navigate(['help-desk/order-list']);
        
        const payload : OrderPayload = {
            canal: route.queryParams.canal,
            devoCompleta: route.queryParams.devoCompleta,
            idPedido: route.queryParams.idPedido,
            legajo: route.queryParams.legajo,
            sucursal: +route.queryParams.sucursal,
            terminal: +route.queryParams.idTerminal,
            tieneDevolucion: route.queryParams.tieneDevolucion,
            transaccion: +route.queryParams.idTransaccion,
            nepluticket: route.queryParams.nepluticket   //  error
        };
        
        return this.orderService.getOrderDetails(payload);
    }
}