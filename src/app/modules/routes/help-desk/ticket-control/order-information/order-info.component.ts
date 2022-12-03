import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { StringSplitterData } from '../../../../common';
import { PluImageComponent } from '../../../../common/plu-image/plu-image.component';
import { StringSplitterComponent } from '../../../../common/string-splitter/string-splitter.component';
import { DynamicComponent, DynamicTableDefinition } from '../../../../ui/dynamic-table';
import { Devolucion, Item } from '../../models/order.model';
import { OrdersControlService } from '../../services/orders-control.service';
import { OrderAmountComponent } from '../order-detail/order-amount/order-amount.component';


@Component({
    selector: 'app-order-info',
    templateUrl: './order-info.component.html',
    styleUrls: ['./order-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderInformationComponent implements OnInit {

    data: Item | null = null

    /* cantidad: 1.77
    fecha: "2022/10/20 16:10:39"
    orden: "083"
    plu: 17162
    subtotal: "1274.22"
    terminal: 3327
    transaccion: 9938 */

    tableDefinition: DynamicTableDefinition = {
        displayedColumns: <Array<keyof Devolucion>>[   
         'cantidad',  
         'fecha',
         'orden',
         'subtotal',  
         'terminal',                                           	
         'transaccion',
         
       ],
        headerCellDefinitions: [
            'Cantidad',  
            'Fecha',
            'Orden',
            'Subtotal',  
            'Terminal',                                            	
            'Transaccion',
        ],
     };
    
  
     /** Formatos custom para columnas del listado de productos. */
     columnFormaters: (((item: Devolucion) => string | number | boolean) | null)[] = [
        (item: Devolucion) => (item.cantidad <= 0) ? 0 : Number(item.cantidad.toFixed(2)),
        null, null,
        (item: Devolucion) => `$ ${item.subtotal}`, 
        null, null
    ];
  
  
    /** Estilos custom para columnas del listado de novedades. */
    columnStyles: (((item: Item) => {[key: string]: string}) | null)[] = [
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
    customColumnComponents: (DynamicComponent | null)[] = [
         /* {
             type: PluImageComponent,
             componentData: <StringSplitterData> {
                 propertyPath: "PLU",
             },
         }, */
         null, null, null, null, null, null, null, null, 
         /* {
           type: StringSplitterComponent,
           componentData: <StringSplitterData>{
               propertyPath: 'EANs',
           },
         },  
         {
           type: StringSplitterComponent,
           componentData: <StringSplitterData>{
               propertyPath: 'devoluciones',
           },
         }, null, null,
         {
           type: OrderAmountComponent,
           componentData: <any>{
               propertyPath: 'cantidadDevolver',
           },
         }
         */
     ];    
    
     items: Item[] = [];

     loading: boolean = false;

     /** `Subject` utilizado para forzar actualizaciones de la tabla de archivos cargados. */
    updateTableFileSource: Subject<boolean> = new Subject<boolean>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public orderService: OrdersControlService,
    ) {}

    ngOnInit(): void {
        /* console.log(this.data);
        if(this.data && this.data?.plu){
            this.items = this.data.items.filter(elem=> elem.plu == this.data?.plu) ?? [];  
        } */
        this.changeDetectorRef.detectChanges();
    }
}
