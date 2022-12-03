import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomCard, Item, error, GetPedidoRequest, DevolucionRequest, PrintRequest, Order } from '../../models/order.model';
import { debounceTime, map, Observable, of, startWith, Subject, take } from 'rxjs';
import { OverlayService } from '../../../../overlay/services/overlay.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicComponent, DynamicTableDefinition, ItemDetailComponent } from '../../../../ui/dynamic-table';
import { StringSplitterComponent } from '../../../../common/string-splitter/string-splitter.component';
import { StringSplitterData } from '../../../../common';
import { PluImageComponent } from '../../../../common/plu-image/plu-image.component';
import { OrderAmountComponent } from './order-amount/order-amount.component';
import { OrderInformationComponent } from '../order-information/order-info.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { OrdersControlService } from '../../services/orders-control.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { PrintOrderComponent } from './print-order/print-order.component';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent implements OnInit {
  
    order: Order | null = null;
    loading: boolean = false;

    orderGroup = this.fb.group({
        /** `FormControl` con el tipo de negociación a efectuar. */
        tipoControl: ['Devolucion' , [Validators.required]],
        /** `FormControl` con el PLU a filtrar. */
        eanPluControl: ['', [Validators.required]],
        /** `FormControl` con el precio del producto. */
        priceControl: [0, [Validators.required]],
        /** `FormControl` con la cantidad del producto. */
        quantityControl: [0, [Validators.required]],
    });

    tableDefinition: DynamicTableDefinition = {
       displayedColumns: <Array<keyof Item>>[   
        'imagen',
        'orden',  
        'plu',
        'descripcion',
        'cantidad',
        'precio',
        'subtotal',                                             	
        'cantNegociada',
        'cantidadDisponible',
        
        'EANs',
        'devoluciones',
        'pesable',
        'cantidadDevolver',
        'Acción',
      ],
       headerCellDefinitions: [
           '', 'Nro Item', 'PLU', 'Descripción', 'Cantidad', 'Precio', 'Subtotal', 'En Negociado', 'Disponible', 'EANs', 'Devoluciones', 'Pesable', 'Cantidad a devolver', 'Escaneado'
       ],
    };
   
 
    /** Formatos custom para columnas del listado de productos. */
    columnFormaters: (((item: Item) => string | number | boolean) | null)[] = [
       null, null, 
       (item: Item) => Number(item.orden),
       null, null, null,
       (item: Item) => `$ ${item.precio}`, 
       (item: Item) => `$ ${item.subtotal}`, 
       (item: Item) => (item.cantNegociada <= 0) ? 0 : Number(item.cantNegociada.toFixed(2)), 
       (item: Item) => (item.cantidadDisponible <= 0) ? 0 : Number(item.cantidadDisponible.toFixed(2)), 
       null, 
       (item: Item) => `${item.devoluciones?.length ?? 0}`, 
       null, null, 
   ];
 
 
   /** Estilos custom para columnas del listado de novedades. */
   columnStyles: (((item: Item) => {[key: string]: string}) | null)[] = [
       null, null, null, null, null, null, null, null, null, null,
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
        null,
        {
            type: PluImageComponent,
            componentData: <StringSplitterData> {
                propertyPath: "PLU",
            },
        },
        null, null, null, null, null, null, null, null, 
        {
            type: StringSplitterComponent,
            componentData: <StringSplitterData>{
                propertyPath: 'EANs',
          },
        }, 
        /* {
          type: StringSplitterComponent,
          componentData: <StringSplitterData>{
              propertyPath: 'devoluciones',
          },
        } */ null, null, null,
        {
          type: OrderAmountComponent,
          componentData: <any>{
              propertyPath: 'cantidadDevolver',
          },
        }
    ];    
   
    //items: Item[] = [];
    
    /** `Subject` utilizado para forzar actualizaciones de la tabla de archivos cargados. */
    updateTableFileSource: Subject<boolean> = new Subject<boolean>();

    /** Componente de detalle a mostrar en la lista de productos. */
    itemDetailComponent: Type<ItemDetailComponent> = OrderInformationComponent;
    
    /** Items seleccionados para su preparación */
    selectedItem?: Item;

    filteredEanPlu: Observable<Item[]>;

    notFilteredColumns: number[] = [0,13];
  
    constructor(
        private activatedRoute: ActivatedRoute, 
        public router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        public pedidosService: OrdersControlService,
        private overlayService: OverlayService,
        private fb: FormBuilder,
        private snackBarService: SnackBarService,
        private matDialog: MatDialog
    ) {
        this.filteredEanPlu = this.orderGroup.controls.eanPluControl.valueChanges.pipe(
            startWith(''),
            debounceTime(1000),
            map(elem => this._filterEanPlu(elem ?? '')),
        );
    }

    mapRef: CustomCard[] = [
        {
            header: 'Cantidad',
            icon: 'fas fa-book',
            value: '',
            color: 'var(--color-defective)',
        },
        {
            header: 'Devueltos',
            icon: 'fas fa-book-medical',
            value: '',
            color: 'var(--color-success)',
        },
        {
        header: 'Resto',
        icon: 'fas fa-tasks',
        value: '',
        color: 'var(--color-accent)',
    },
    ];
/* 
    private groupByPluItems(arr: Item[] = []): Item[] {
        var unique = [];
        let i;
        for(i=0; i < arr.length; i++){ 
            if(unique.indexOf(arr[i]) === -1) { 
                unique.push(arr[i]); 
            } 
        }
        return unique;
    } */

    private updateDashboard(){
        //this.items = this.order?.items ?? [];
        //console.log(this.items);
        if(!this.order) return;

        this.selectedItem = this.order.items[0];
        
        //Cantidad de series a leer.
        this.mapRef[0].value = ''+this.order.items.length ?? '0'; //+this.novelties.filter(item => item.estado =='wip').length; 

        //Cantidad de series leídos.
        const cant_readed = this.order.items.filter((item: Item) => item.cantidad > 0).length;
        this.mapRef[1].value = ''+cant_readed;

        //Porcentaje de avance del conteo.
        this.mapRef[2].value = (this.order.items.length>0 ? (cant_readed/this.order.items.length)* 100 : 0).toFixed(2) +' %';   //+this.novelties.filter(item => item.estado !='wip' && today == item.fecha_ult_actualizacion.split("T")[0]).length;
        setTimeout(() =>{
            this.overlayService.hideLoadingOverlay();
            this.loading = false;
            this.updateTableFileSource.next(true);
            this.changeDetectorRef.detectChanges();
        }, 100);
    }

    ngOnInit(): void {
        /** Obtiene la lista de conteos precargada por el resolver */
        this.loading = true;
        this.activatedRoute.data.pipe(take(1)).subscribe(data => {
            this.order = data.orderDetail;
            this.loading = false;
            this.updateDashboard();
        });
    }

    private _filterEanPlu(value: string): Item[] {
        let items : Item[] = [];
        
        if (value){
            const item = this.order?.items.filter(item => item.EANs.includes(value) || item.plu.toString().includes(value));
            items = (item) ? item : []; 
            if(items.length == 0) this.orderGroup.controls.eanPluControl.setValue(value);
        }else 
            items = this.order?.items.slice() ?? [];
        return items;
    }

    isEanOrPLU(value:string | null): boolean {
        return (!!value && value.length < 7);  // Plu: true  - EAN: false
    }

    searchOrder(item?: Item){

        const form = this.orderGroup.controls;

        //form.eanPluControl.setValue((item) ? id : form.eanPluControl.value?.trim());
        
        
        if(!item){ //|| form.tipoControl.value === 'Facturacion'
            
            this.searchArticle(form.eanPluControl.value ?? '');
        }else {
            form.eanPluControl.setValue(''+item.plu);
            this.selectedItem = item;
            this.getMaxFormQuantities();
            
            this.scrollToElement(item.plu, -100);
        }
            
    
    }

    changeItem(){

        const form = this.orderGroup.controls;
        
        if(this.orderGroup.invalid){
            this.snackBarService.open(`ERROR: Supera la cantidad disponible`, "Aceptar", 6000, "warning-snackbar");
            return;
        } 
        const cantDevol = form.quantityControl.value;
        /* this.selectedItem.map((item: Item) => {
            item.cantidadDevolver = (cantDevol && item.cantidadDisponible >= cantDevol) ? cantDevol : item.cantidadDisponible;
            console.log(item, cantDevol);
        }); */
        
        if(!this.selectedItem || !this.order) return;
        
        this.selectedItem.cantidadDevolver = cantDevol ?? 0;
        const pos = this.order.items.forEach(elem => {
            if (elem.plu == this.selectedItem?.plu) elem = {...this.selectedItem};
        });
        this.scrollToElement(this.selectedItem.plu, -100);
    }


    getMaxFormQuantities(){

        if(!this.selectedItem) return;

        const form = this.orderGroup.controls;
        let maxCant = 0;
        
        //Quantity validation
        if(!this.selectedItem.esPluAjuste && this.order){
            
            this.order.items.map(elem => {
                if(elem.plu === this.selectedItem?.plu){
                    //item.cantidadDevolver = item.cantidadDisponible;
                    maxCant += elem.cantidadDisponible;
                }
            });
            form.quantityControl.setValidators([Validators.required, Validators.max(maxCant+0.01)]);  
            form.quantityControl.setValue(+maxCant.toFixed(2));
        }else{
            form.quantityControl.setValue(1);
        }
        form.priceControl.setValue((this.selectedItem.esPluAjuste) ? 0 : +this.selectedItem?.precio.replace(',','.'));
            
    }

    scrollToElement(anchorId: number = 0, offset: number = 0){
        this.updateTableFileSource.next(true);   // renderice table with updated item values
        setTimeout(()=> {
            const element = document.getElementById(`item${anchorId}`);
            
            let offsetPosition = 0;
            if(element){
                const elementPosition = element.getBoundingClientRect().top;
                offsetPosition = elementPosition + offset;
                element.style.background = "red";   
            }
            window.scrollBy({
                top: offsetPosition,
                behavior: "smooth"
            });
        }, 1000);
        
    }

    devolverTotal(){
        this.order?.items.forEach((item: Item) => item.cantidadDevolver = item.cantidadDisponible);
        this.updateTableFileSource.next(true);  
    }

    ponerACero(){
        //this.orderGroup.reset();
        this.order?.items.forEach((item: Item) => item.cantidadDevolver = 0);
        this.updateTableFileSource.next(true);  
    }

    puedeDevolver() : boolean {
        const form = this.orderGroup.controls;
        return (form.tipoControl.value != "Devolucion") ? this.order?.flag2 == 1 :  !!this.order?.items.find(elem=> elem.cantidadDevolver > 0) ;
      
    }


    searchArticle(eansl: string){
        
        const form = this.orderGroup.controls;
        
        let payload : GetPedidoRequest = {
            tieneDevolucion: this.isEanOrPLU(eansl),
            sucursal: +this.order?.sucursal!,
            tipoNegociado: form.tipoControl.value ?? '',
            devoCompleta: eansl,
            nepluticket: this.order?.nepluticket!,
            idPedido: this.order?.idPedido ?? '',
            terminal: +this.order?.idTerminal!, 
            transaccion: +this.order?.idTransaccion!, 
            canal: this.order?.canal ?? '', 
            legajo: this.order?.legajo ?? '',
        }

        this.loading = true;
        this.overlayService.displayLoadingOverlay();
        this.pedidosService.getArticulo(payload).subscribe({
            next: (res) => { 
               
                if(res.error.CODIGO>0){
                    this.errorHandler(res.error);
                }else if(!res.items || res.items.length==0){
                    this.snackBarService.open(`ERROR: PLU no existe`, "Aceptar", 6000, "warning-snackbar");
                    form.quantityControl.setValue(0);
                    form.priceControl.setValue(0);
                    this.scrollToElement();
                } else {
                    this.selectedItem = res.items[0];

                    this.getMaxFormQuantities();

                    //form.priceControl.setValue((this.selectedItem.esPluAjuste) ? 0 : +this.selectedItem.precio.replace(',','.'));

                    this.order?.items.push({...this.selectedItem});
                     console.log(this.selectedItem);
                     
                    this.scrollToElement(this.selectedItem.plu, -100);
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.open(`No se pudo guardar la información. El servidor no responde.`, "Aceptar", 6000, "warning-snackbar");
            }, complete: ()=> {
                this.loading = false;
                this.overlayService.hideLoadingOverlay();
            } 
        });
    }

    print(){
        if(!this.order) return;
        console.log(this.order);
        
        const form = this.orderGroup.controls;
        let payload:PrintRequest= {
            canal : this.order.canal ?? '',
            idPedido : this.order.idPedido ?? '',
            sucursal : this.order.sucursal!,
            tipoNegociado : form.tipoControl.value ?? '',
            legajo : this.order.legajo ?? '',
            btnautorizar: false,
            devoparc : this.order.devolucionesParciales ?? 'NO',
        }
        this.pedidosService.getPrintData(payload).subscribe({
            next: (res) => {
              if(res.error.CODIGO>0){
                this.errorHandler(res.error);
              } else {

                this.matDialog.open(PrintOrderComponent, {
                    data: {
                        panelClass: "xs-padding-panel",
                        height: '100%',
                        data: res,
                    }
                }).afterClosed().subscribe(data => {
                    if (data) {
                        console.log(data);
                        
                        this.router.navigate(['/order-list']);
                    }
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


    errorHandler(error: error){
        this.snackBarService.open(`${error.MENSAJE}`, "Aceptar", 6000, "warning-snackbar");
        if(error.CODIGO == 10)
            this.router.navigate(['/sign/in']);
    }

    realizarDevolucion(){
        //event.preventDefault();
        this.loading = true;
        const form = this.orderGroup.controls;

        let payload : DevolucionRequest = {
            sucursal: +this.order?.sucursal!,
            tipoNegociado: form.tipoControl.value ?? '',  // == "Facturacion" ? "02" : "02";
            idPedido: this.order?.idPedido ?? '',
            terminal: this.order?.idTerminal!, 
            transaccion: this.order?.idTransaccion!, 
            canal: this.order?.canal ?? '', 
            flag: form.tipoControl.value == "Facturacion" ? 1 : 2,
            esPluAjuste : (this.order && +this.order.percepciones > 0) ?? false,
            dni: this.order?.dni!,
            items: this.order?.items.filter(item => item.cantidadDevolver>0 ) ?? [],
            totalDevolver: '',
        }        

        let subtotal:number = 0;
        payload.items.forEach( item => {
            delete(item.negociados);
            item.subtotal = (item.cantidadDevolver*(+item.precio.replace(',','.'))).toFixed(2);
            subtotal += (+item.subtotal);
        });
        payload.totalDevolver = `${subtotal.toFixed(2)}`;
 
        console.log(payload);
        
        
        
        if(subtotal < 0.01){
            this.snackBarService.open(`La deferencia del importe del negociado es nula.`, "Aceptar", 6000, "warning-snackbar");
            return;
        }


        
        this.pedidosService.realizarDevolucion(payload).subscribe({
            next: (res) => { 
                if(res.error.CODIGO>0){
                    this.errorHandler(res.error);
                } else {
                    this.print();
                }
                
            },
            error: (error) => {
                console.log(error);
                
                this.snackBarService.open(`No se pudo guardar la información. El servidor no responde.`, "Aceptar", 6000, "warning-snackbar");
            },
            complete: ()=> {
                this.loading = false;
            }
        });  
          
    }

/* 
    
    realizarDevolucionByProduct(){

        this.loading = true;
        const form = this.orderGroup.controls;

        if(!this.selectedItem) return; 

        let payload : DevolucionRequest = {
            sucursal: +this.order?.sucursal!,
            tipoNegociado: form.tipoControl.value ?? '',  // == "Facturacion" ? "02" : "02";
            idPedido: this.order?.idPedido ?? '',
            terminal: +this.order?.idTerminal!, 
            transaccion: +this.order?.idTransaccion!, 
            canal: this.order?.canal ?? '', 
            flag: 2,
            esPluAjuste : this.selectedItem.esPluAjuste,
            dni: this.order?.dni!,
            items: this.items.filter(elem => elem.plu != this.selectedItem?.plu),
            totalDevolver: '',
        }


        let subtotal:number = 0;
        payload.items.forEach( item => {
            item.subtotal = (item.cantidadDevolver*(+item.precio.replace(',','.'))).toFixed(2);
            subtotal += (+item.subtotal);
        });
        payload.totalDevolver = `${subtotal}`;

        console.log(payload);
        
 
        if (payload.tipoNegociado == "Devolucion"){
            payload.items = this.order?.items.filter(x => x.orden == "001") ?? [];

            payload.items[0].plu = +form.eanPluControl.value!;
            payload.items[0].descripcion = this.selectedItem.descripcion ?? '';
            payload.items[0].cantidad = form.quantityControl.value ?? 0;
            payload.items[0].precio = ''+form.priceControl.value;
            payload.items[0].subtotal = ''+(payload.items[0].cantidad * +payload.items[0].precio);

            this.loading = true;
            this.pedidosService.realizarDevolucion(payload).subscribe({
                next: (res) => { 
                    
                    if(res.error.CODIGO>0){
                        this.snackBarService.open(`${res.error}`, "Aceptar", 6000, "warning-snackbar");
                    } else {
                        this.snackBarService.open(`Se genero el negociado correctamente.`, "Aceptar", 6000, "success-snackbar");
                        //this.abrirPedido(this.pedido, "", "", "", "", this.operacionSeleccionada, false);
            
                    }
                },
                error: error => {
                    this.snackBarService.open(`ERROR: ${error}`, "Aceptar", 6000, "warning-snackbar");
                }, 
                complete: ()=>{ this.loading = false;}
            });
        }else {

            if (this.selectedItem && this.selectedItem.orden == '000')
                this.selectedItem.orden = '001';
            else
                return;

            payload.items[0].plu = +form.eanPluControl.value!;
            payload.items[0].descripcion = this.selectedItem.descripcion;
            payload.items[0].cantidad = form.quantityControl.value ?? 0;
            payload.items[0].precio = ''+form.priceControl.value;
            payload.items[0].subtotal = ''+(payload.items[0].cantidad * +payload.items[0].precio);
            //payload.items = this.order?.items.filter(x => x.orden = this.selectedItem.orden)
            
        
            this.loading = true;
            this.pedidosService.realizarDevolucion(payload).subscribe({
                next: res => { 
                    if(res.error.CODIGO>0){
                        this.snackBarService.open(`${res.error}`, "Aceptar", 6000, "warning-snackbar");
                    } else {
                        this.snackBarService.open(`Se genero el negociado correctamente.`, "Aceptar", 6000, "success-snackbar");
                        //this.abrirPedido(this.pedido, "", "", "", "", this.operacionSeleccionada,false);
                    }
                },
                error: error => {
                    this.snackBarService.open(`ERROR: ${error}`, "Aceptar", 6000, "warning-snackbar");
                }, 
                complete: ()=>{ this.loading = false;}
            });
        }
    }

    realizarDevolucionTotal(){
        //event.preventDefault();
        this.loading = true;
        const form = this.orderGroup.controls;

        if(!this.selectedItem) return;

        let payload : DevolucionRequest = {
            sucursal: +this.order?.sucursal!,
            tipoNegociado: form.tipoControl.value ?? '',  // == "Facturacion" ? "02" : "02";
            idPedido: this.order?.idPedido ?? '',
            terminal: +this.order?.idTerminal!, 
            transaccion: +this.order?.idTransaccion!, 
            canal: this.order?.canal ?? '', 
            flag: 1,
            esPluAjuste : this.selectedItem?.esPluAjuste,
            dni: this.order?.dni!,
            items: this.items.filter(elem => elem.plu != this.selectedItem?.plu),
            totalDevolver: '',
        }

        let subtotal:number = 0;
        payload.items.forEach( item => {
            item.subtotal = (item.cantidadDevolver*(+item.precio.replace(',','.'))).toFixed(2);
            subtotal += (+item.subtotal);
        });
        payload.totalDevolver = `${subtotal}`;
 
        if (payload.tipoNegociado == "Devolucion"){
            payload.items = this.order?.items.filter(item => item.cantidadDevolver>0 ) ?? [];
            let subtotal:number = 0;
            payload.items.forEach( item => {
                item.subtotal = (item.cantidadDevolver*(+item.precio.replace(',','.'))).toFixed(2);
                subtotal = subtotal + (+item.subtotal);
            });
            if(subtotal > 0){
                //this.load = false;
                this.pedidosService.realizarDevolucion(payload).subscribe({
                    next: (res) => { 
                        if(res.error.CODIGO>0){
                        this.snackBarService.open(`${res.error}`, "Aceptar", 6000, "warning-snackbar");
                        } else {
                            this.print();
                        }
                        
                    },
                    error: (error) => {
                        console.log(error);
                        
                        this.snackBarService.open(`No se pudo guardar la información. El servidor no responde.`, "Aceptar", 6000, "warning-snackbar");
                    },
                    complete: ()=> {
                        this.loading = false;
                    }
                });  
            }   
        } else
            this.print(); 
    }

    realizarDevolucion(flag: number){
        //event.preventDefault();
        this.loading = true;
        const form = this.orderGroup.controls;

        let payload : DevolucionRequest = {
            sucursal: +this.order?.sucursal!,
            tipoNegociado: form.tipoControl.value,  // == "Facturacion" ? "02" : "02";
            idPedido: this.order?.idPedido ?? '',
            terminal: +this.order?.terminal!, 
            transaccion: +this.order?.transaccion!, 
            canal: this.order?.canal ?? '', 
            flag: flag,
            esPluAjuste : this.selectedItem.esPluAjuste,
            dni: this.order?.dni!,
            items: this.selectedItem,
            totalDevolver: '',
        }


        let subtotal:number = 0;
        payload.items.forEach( item => {
            item.subtotal = (item.cantidadDevolver*(+item.precio.replace(',','.'))).toFixed(2);
            subtotal += (+item.subtotal);
        });
        payload.totalDevolver = `${subtotal}`;
 
        if (payload.tipoNegociado == "Devolucion"){
            if (flag == 1){
                payload.items = this.order?.items.filter(item => item.cantidadDevolver>0 ) ?? [];
                let subtotal:number = 0;
                payload.items.forEach( item => {
                    item.subtotal = (item.cantidadDevolver*(+item.precio.replace(',','.'))).toFixed(2);
                    subtotal = subtotal + (+item.subtotal);
                });
                if(subtotal > 0){
                    //this.load = false;
                    this.pedidosService.realizarDevolucion(payload).subscribe({
                        next: (res) => { 
                            if(res.error.CODIGO>0){
                            this.snackBarService.open(`${res.error}`, "Aceptar", 6000, "warning-snackbar");
                            } else {
                                this.print();
                            }
                            
                        },
                        error: (error) => {
                            this.snackBarService.open(`No se pudo guardar la información. El servidor no responde.`, "Aceptar", 6000, "warning-snackbar");
                        },
                        complete: ()=> {
                            this.loading = false;
                        }
                    });  
                }else
                    this.print(); 
            }else{
                payload.items = this.order?.items.filter(x => x.orden == "001") ?? [];

                payload.items[0].plu = form.eanPluControl.value;
                payload.items[0].descripcion = this.selectedItem.descripcion;
                payload.items[0].cantidad = form.quantityControl.value;
                payload.items[0].precio = form.priceControl.value;
                payload.items[0].subtotal = ''+(payload.items[0].cantidad * +payload.items[0].precio);
                this.loading = true;
                this.pedidosService.realizarDevolucion(payload).subscribe({
                    next: (res) => { 
                        
                        if(res.error.CODIGO>0){
                            this.snackBarService.open(`${res.error}`, "Aceptar", 6000, "warning-snackbar");
                        } else {
                            this.snackBarService.open(`Se genero el negociado correctamente.`, "Aceptar", 6000, "success-snackbar");
                            //this.abrirPedido(this.pedido, "", "", "", "", this.operacionSeleccionada, false);
                
                        }
                    },
                    error: error => {
                        this.snackBarService.open(`ERROR: ${error}`, "Aceptar", 6000, "warning-snackbar");
                    }, 
                    complete: ()=>{ this.loading = false;}
                });
            }
        } else {
            if (flag == 1)
                this.print();
            else{
                if (this.selectedItem.orden == '000')
                    this.selectedItem.orden = '001';

                payload.items[0].plu = form.eanPluControl.value;
                payload.items[0].descripcion = this.selectedItem.descripcion;
                payload.items[0].cantidad = form.quantityControl.value;
                payload.items[0].precio = form.priceControl.value;
                payload.items[0].subtotal = ''+(payload.items[0].cantidad * +payload.items[0].precio);
                //payload.items = this.order?.items.filter(x => x.orden = this.selectedItem.orden)
              
            
                this.loading = true;
                this.pedidosService.realizarDevolucion(payload).subscribe({
                    next: res => { 
                        if(res.error.CODIGO>0){
                            this.snackBarService.open(`${res.error}`, "Aceptar", 6000, "warning-snackbar");
                        } else {
                            this.snackBarService.open(`Se genero el negociado correctamente.`, "Aceptar", 6000, "success-snackbar");
                            //this.abrirPedido(this.pedido, "", "", "", "", this.operacionSeleccionada,false);
                        }
                    },
                    error: error => {
                        this.snackBarService.open(`ERROR: ${error}`, "Aceptar", 6000, "warning-snackbar");
                    }, 
                    complete: ()=>{ this.loading = false;}
                });
            }
          }
          //this.load = true;
    }  */
    


}


