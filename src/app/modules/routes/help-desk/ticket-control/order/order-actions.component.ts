
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from 'src/app/modules/ui/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CustomCellComponent } from 'src/app/modules/ui/dynamic-table';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { OrdersControlService } from '../../services/orders-control.service';
import { ProfileService } from 'src/app/modules/main/services/profile.service';
import { Router } from '@angular/router';
import { Order, OrderAction, PrintRequest, PrintResponse } from '../../models/order.model';
import { PrintOrderComponent } from '../order-detail/print-order/print-order.component';

@Component({
  selector: 'app-order-actions',
  templateUrl: './order-actions.component.html',
  styleUrls: ['./order-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderActionsComponent implements CustomCellComponent, OnInit {
  /** Es asginada por la dynamic table */
  data: Order | null = null;

  loading: boolean = false;

  /** Las acciones posibles que se pueden realizar de ese conteo segun su estado */
  actions: OrderAction[] = [];
  constructor(
    private matDialog: MatDialog,
    private pedidosService: OrdersControlService,
    private snackBarService: SnackBarService,
    private profileService: ProfileService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    //this.actions = this.getOrderActions(this.data).filter(action => this.userHasPermissionForAction(action))
    this.actions = this.getAllOrderActions();
  }

  /**
   * Realiza la accion clickeada en el menu de acciones del conteo y avisa para que se actualice la tabla
   * @param action La accion a realizar
   */
  handleAction(action: OrderAction){
    
    switch(action.name)
    {
      case('detalle'):{
        this.router.navigate(['/help-desk/order-detail'], {queryParams: this.data, skipLocationChange: true} );
        history.pushState(this.data, "", "/help-desk/order-detail");
        break;
      }
      case('imprimir'): {
        this.print();
        /* const confirmationDialogData: ConfirmationDialogData = {
          title: 'Imprimir negociado',
          message: 'Esta seguro que desea imprimir el negociado?',
          color: 'primary',
        }
        this.matDialog.open(ConfirmationDialogComponent, {
          width: "300px",
          data: confirmationDialogData
        }).afterClosed().subscribe((result: boolean | string) => {
            if (result) this.print()
        }); */
        break;
      } 
      
      case('cancelar'):{
        const confirmationDialogData: ConfirmationDialogData = {
          title: 'Cancelar pedido',
          message: 'Se cancelará el pedido ' + this.data?.idPedido + ' ¿Desea continuar?',
          color: 'primary',
        }
        this.matDialog.open(ConfirmationDialogComponent, {
          width: "300px",
          data: confirmationDialogData
        })
        .afterClosed().subscribe((result: boolean | string) => {
            if (result) this.deleteDevolOrder();
        });
        break;
      }
      default:{}
    }
  }

    /**
     * Devuelve todas las acciones que se pueden realizar para un conteo
    */
    private getAllOrderActions(): OrderAction[]{
        if(!this.data) return [];
        
        let actions: OrderAction[] = [{name: 'detalle', title: 'Ver detalle', icon: 'info', permission: 'Orders_ver-detalle', availableStates: []}];
        if(this.data.devolucionPendiente == 'SI'){
            actions = [
                {name: 'detalle', title: 'Ver detalle', icon: 'info', permission: 'Orders_ver-detalle', availableStates: []},
                {name: 'cancelar', title: 'Cancelar negociado', icon: 'cancel', color: '#F08080',  permission: 'Orders_cancelar-conteo', availableStates: []},
                {name: 'imprimir', title: 'Imprimir negociado', icon: 'print', permission: 'Orders_informar-conteo', availableStates: []},
            ];
        }
        return actions;
    }
  
    /**
   * Devuelve la lista de acciones que pueden realizarse para ese conteo
   * @param state 
   * @returns Una lista de acciones
   */
    getOrderActions(state: number): OrderAction[]{
        return this.getAllOrderActions().filter(a => a.availableStates?.length==0 || a.availableStates!.includes(state));
    }

    userHasPermissionForAction(action: OrderAction): boolean {
        return action.permission ? this.profileService.hasPermission(action.permission) : true;
    }

    print(){
        if(!this.data) return;
        let payload : PrintRequest = {
            canal : this.data.canal ?? '',
            idPedido : this.data.idPedido ?? '',
            sucursal : this.data.sucursal!,
            tipoNegociado : this.data.tipoNegociado ?? '',
            legajo : this.profileService.user.legajo ?? '', // legajo : this.orderDetail?.legajo ?? '',
            btnautorizar: false,
            devoparc : this.data.devolucionesParciales ?? 'NO',
        }
        this.pedidosService.getPrintData(payload).subscribe({
            next: (response) => {
            if(response.error.CODIGO>0){
                this.snackBarService.open(`${response.error}`, "Aceptar", 6000, "warning-snackbar");
            } else {
                this.matDialog.open(PrintOrderComponent, {
                    panelClass: "xs-padding-panel",
                    height: '100%',
                    data: response
                });
            }
            },
            error: (error) => {
                this.snackBarService.open(`No se pudo cargar la página de impresión.`, "Aceptar", 6000, "warning-snackbar");
            },
            complete: ()=> {
                this.loading = false;
            }
        });
    }


    deleteDevolOrder(){
        if(!this.data) return;

        let payload : PrintRequest= {
            canal : this.data.canal ?? '',
            idPedido : this.data.idPedido ?? '',
            sucursal : this.data.sucursal!,
            tipoNegociado : this.data.tipoNegociado ?? '',
            legajo : this.profileService.user.legajo ?? '', // legajo : this.orderDetail?.legajo ?? '',
            btnautorizar: false,
            devoparc : this.data.devolucionesParciales ?? 'NO',
        }
        
        this.pedidosService.eliminaDP(payload).subscribe({
            next: (res) => {
                console.log(res);
                if(res.error.CODIGO>0)
                    this.snackBarService.open(`${res.error}`, "Aceptar", 6000, "warning-snackbar");
                else{
                    this.actions = [{name: 'detalle', title: 'Ver detalle', icon: 'info', permission: 'Orders_ver-detalle', availableStates: []}];
                    this.snackBarService.open(`Se elimino el negociado ${this.data?.idPedido} correctamente`, "Aceptar", 6000, "success-snackbar");
                }
            },
            error: error =>
                this.snackBarService.open(`${error}`, "Aceptar", 6000, "warning-snackbar"),
            complete: ()=> this.loading = false,
        });
      }


}
