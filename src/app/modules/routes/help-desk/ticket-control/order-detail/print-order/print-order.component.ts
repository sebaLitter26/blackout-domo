import { ChangeDetectionStrategy, Component, Inject, Type } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../../../services/snackbar.service';
import { OverlayService } from '../../../../../overlay/services/overlay.service';
import { DynamicTableDefinition, DynamicTableGroupingHeader } from '../../../../../ui/dynamic-table';
import { Item, PrintRequest, PrintResponse } from '../../../models/order.model';
import { OrdersControlService } from '../../../services/orders-control.service';


@Component({
    selector: 'app-print-order',
    templateUrl: './print-order.component.html',
    styleUrls: ['./print-order.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintOrderComponent {

    loading: boolean = true;

    tableDefinition: DynamicTableDefinition = {
        displayedColumns: <Array<keyof Item>>[                                                  	
            'plu','descripcion','cantidad','precio','subtotal',
        ],
        headerCellDefinitions: [
            'Producto','Descripcion','Cantidad','Precio','Subtotal',
        ],
    };

    groupingHeaders: DynamicTableGroupingHeader = {
        columnNames: ["- Sucursal: -", "Total: -"],
        columnSpans: [2, 3],
    }

    /** Formatos custom para columnas del listado de productos. */
    columnFormaters: (((item: any) => string | number | boolean) | null)[] = [
        null,null, 
        (pedido: Item) =>  `$ ${pedido.precio}`,
        (pedido: Item) => `$ ${pedido.subtotal}`,  
        null
    ];


    /** Estilos custom para columnas del listado de novedades. */
    columnStyles: (((item: Item) => {[key: string]: string}) | null)[] = [
        null, null,
        /* (item: Item) => {
            return {
                "color": 'snow',
                "padding": "5px",
                "box-sizing": "border-box",
                "width": "100px",
                "border-radius": "5px",
                "background-color": (item!.estado == ExpeditionState.PENDIENTE_RECEPCION) ? 'var(--color-wip)': 'var(--color-ok)',
            }
        } , */
        null, null
    ];

    constructor(
        private snackBarService: SnackBarService,
        private overlayService: OverlayService,
        public router: Router,
        public pedidosService: OrdersControlService,
        public dialogRef: MatDialogRef<PrintOrderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PrintResponse
    ) {
        this.groupingHeaders.columnNames[0] = `${this.data.canal} Sucursal: ${this.data.sucursal}`;
        //this.groupingHeaders.columnNames[1] = `Pedido: ${this.data.idPedido}`;
        this.groupingHeaders.columnNames[1] = `Total  ${this.data.TipoNegociado}: $ ${this.data.totalDevolver} `;
        console.log(this.data);
        
    }

    print(){
        document.title = 'Imprimir Negociado Pedido: ' + this.data?.idPedido;
        window.print();
    }

    autorizar(){
        if(!this.data) return;
        let payload: PrintRequest = {
            canal : this.data.canal,
            idPedido : this.data.idPedido,
            sucursal : this.data.sucursal,
            tipoNegociado : this.data.TipoNegociado,
            legajo : this.data.legajo,
            btnautorizar : true,
            devoparc: ''
        }
        this.loading = true;
        this.overlayService.displayLoadingOverlay();
        this.pedidosService.getPrintData(payload).subscribe({
            next: res => {
                if(res.error.CODIGO>0)
                    this.snackBarService.open(`ERROR: ${res.error.MENSAJE}`, "Aceptar", 6000, "warning-snackbar");
                else {
                    //this.pedido = res;
                    console.log(res);
                    this.snackBarService.open(`La negociacion se autorizo correctamente`, "Aceptar", 6000, "success-snackbar");
                    
                }
                    
            },
            error: (error) => {
                this.snackBarService.open(`No se pudo cargar la página de impresión.`, "Aceptar", 6000, "warning-snackbar");
            },
            complete: ()=> {
                this.overlayService.hideLoadingOverlay();
                this.loading = false;
            }
        });
    }

}
