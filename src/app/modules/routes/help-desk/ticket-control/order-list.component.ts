import { Component, OnInit, Type } from '@angular/core';
import { DynamicTableDefinition, ItemDetailComponent, CustomCellComponent } from '../../../ui/dynamic-table/index.d';
import { Order, OrderFilter } from '../models/order.model';
import { OrdersControlService } from '../services/orders-control.service'
import { Subject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayService } from '../../../overlay/services/overlay.service';
import { OrderActionsComponent } from './order/order-actions.component';
import { ProfileService } from 'src/app/modules/main/services/profile.service';
import { OrderInformationComponent } from './order-information/order-info.component';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {


    orderListGroup = this.fb.group({
        /** `FormControl` con el ID de Sucursal a filtrar. */
        sucursalControl: [219 , [Validators.required]],
        /** `FormControl` con el Pedido a filtrar. */
        pedidoControl: ['19137354',[Validators.required]],
        /** `FormControl` la fecha de Solicitud a filtrar. */
        ticketDate: [ ''],
        /** `FormControl` con el número de Transacción. */
        transactionControl: [ ''],
        /** `FormControl` con el número de Terminal. */
        terminalControl: [ ''],
      });

    tableDefinition: DynamicTableDefinition = {
        displayedColumns: <Array<keyof Order>>[                                                  	
            "idPedido", "idTerminal", "idTransaccion", "fecha", "tipoOperacion", "canal", "importeTotal", "tipoNegociado", "devolucionTotal", "devolucionesParciales", "importeDevuelto", "devolucionPendiente", 'Acción'
        ],
        headerCellDefinitions: [
            'Pedido', 'Terminal', 'Transacción', 'Fecha', 'Tipo Operación', 'Canal', 'Importe Total', 'Tipo de Negociado', 'Movimientos Totales', 'Movimientos Parciales', 'Importe del Movimiento', 'Movimientos Pendientes', ''
        ],
    };

    /** Formatos custom para columnas del listado de productos. */
    columnFormaters: (((item: any) => string | number | boolean) | null)[] = [
        null,null,null,null, null, null, 
        (pedido: Order) => {
            return `$ ${pedido.importeTotal}`;
        },null, null, null, 
        (pedido: Order) => {
            return `$ ${pedido.devoCompleta}`;
        },  
        null
    ];


    /** Estilos custom para columnas del listado de novedades. */
    columnStyles: (((item: Order) => {[key: string]: string}) | null)[] = [
        null, null, null, null, null, null, null, null, null,
        /* (item: Order) => {
            return {
                "color": 'snow',
                "padding": "5px",
                "box-sizing": "border-box",
                "width": "100px",
                "border-radius": "5px",
                "background-color": (item!.estado == ExpeditionState.PENDIENTE_RECEPCION) ? 'var(--color-wip)': 'var(--color-ok)',
            }
        } , */
        null
    ];

    /** Componentes custom para listado de reservas. */
    customColumnComponents: (Type<CustomCellComponent> | null)[] = [
        null, null, null, null, null, null, null, null, null, null, null, null, OrderActionsComponent
    ];    

    /** Componente de detalle a mostrar en la lista de productos. */
    //itemDetailComponent: Type<ItemDetailComponent> = OrderInformationComponent;
    
    orders: Order[] = [];

    /** `Subject` utilizado para forzar actualizaciones de la tabla de archivos cargados. */
    updateTableFileSource: Subject<boolean> = new Subject<boolean>();

    /** Items seleccionados para su preparación */
    selectedItems: Order[] = [];

    loading: boolean = false;

    sucursales: number[] = [
        56,
        60,
        63,
        64,
        65,
        75,
        78,
        85,
        90,
        91,
        107,
        109,
        129,
        131,
        160,
        165,
        178,
        184,
        185,
        188,
        189,
        197,
        204,
        209,
        215,
        219,
        220,
        250,
        250
      ]; //this.profileService.user.sucursales;

    constructor(
        public pedidosService: OrdersControlService,
        private profileService: ProfileService,
        private overlayService: OverlayService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //this._initDefaultFilters();
        //this.searchExpeditions();
    }


    /** Actualiza los items actualmente seleccionados. */
    updateSelectedItems($event: Order[]) {
        this.selectedItems = $event;
    }

    searchPedidos() : void {

        const formList = this.orderListGroup.controls;

        const filters: OrderFilter = {
            sucursal: ''+formList.sucursalControl.value,
            nroPedido: formList.pedidoControl.value,
            transaccion: formList.transactionControl.value,
            terminal: formList.terminalControl.value,
            fechaTicket: formList.ticketDate.value,
        }
        
        this.overlayService.displayLoadingOverlay();
        this.loading = true;
        this.pedidosService.getOrders(filters).subscribe((items: Order[]) => {
           
            this.orders = items;
          
            setTimeout(() =>{
                this.overlayService.hideLoadingOverlay();
                this.loading = false;
                this.updateTableFileSource.next(true);
            }, 100);
        });
    }
}
