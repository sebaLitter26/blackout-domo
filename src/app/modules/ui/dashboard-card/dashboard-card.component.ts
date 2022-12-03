import { Component, OnInit, Input, Type, Directive, ViewContainerRef, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ItemDetailHostDirective } from './directives/item-detail-host.directive';

const BOTTOM_POSITION_FACTOR: number = 96 / -1 // 96px icon size, -2rem (-32px) right position
const LEFT_POSITION_FACTOR: number = 96 / -2 // 96px icon size, -1rem (-16px) left position

@Component({
    selector: 'app-dashboard-card',
    templateUrl: './dashboard-card.component.html',
    styleUrls: ['./dashboard-card.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
        trigger('rotate', [
            state('right', style({ transform: 'rotate(0deg)'})),
            state('bottom', style({ transform: 'rotate(90deg)'})),
            transition('right <=> bottom', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class DashboardCardComponent {

    /** El valor numérico a mostrar. */
    @Input()
    value: string = "Valor de la tarjeta";
    /** La descripción semántica del valor mostrado. */
    @Input()
    description: string = "Descripción de la tarjeta";
    /** El color de la tarjeta. Se aplica el mismo color con una opacidad del 40% al icono. */
    @Input()
    color: string = "var(--color-primary)";
    /** El icono a mostrar. Este parámetro es opcional. */
    @Input()
    icon: string = "fa fa-fw fa-4x fa-smile";
    /** El tamaño de la fuente a usar en el valor. */
    @Input()
    valueSize: string = "24px";
    /** El tamaño de la fuente a usar en la descripción. */
    @Input()
    descriptionSize: string = "16px";
    /** El tamaño del icono. */
    @Input()
    iconSize: string = "96px";
     /** Width del contenido. */
    @Input()
    contentWidth: string = "100%";
    /** Receptor de la clase que toma el componente custom a renderizar. */
    @Input()
    expandableDetailComponent: Type<any> | null = null;

    /** Receptor de la clase que toma el componente custom a renderizar. */
    @Input()
    componentData: any | null = null;

    bottomPoisitionFactor: number = BOTTOM_POSITION_FACTOR;
    leftPositionFactor: number = LEFT_POSITION_FACTOR;
    numberIconSize: number = Number.parseInt(this.iconSize.split("p")[0]);
    
    @ViewChildren(ItemDetailHostDirective)
    private dashboardCustomComponent: QueryList<ItemDetailHostDirective> | null = null;

    /*
    * Propiedad para validar si el componente dinamico esta expandido o no.
    */
    expandedItem: boolean = false;

    /* 
    * Método que muestra un nuevo componente custom desplegable siempre que sea definica la clase expandableDetailComponent.
    */    
    __onClick__(): void {
        this.expandedItem = !this.expandedItem;
        
        if (this.expandableDetailComponent != null && this.dashboardCustomComponent != null) {
            const viewContainerRef = this.dashboardCustomComponent.first.viewContainerRef;
            viewContainerRef.clear();
            const componentRef = viewContainerRef.createComponent<any>(this.expandableDetailComponent);
            componentRef.instance.componentData = this.componentData;
            console.log('Generate!')
        }    
    }


}
