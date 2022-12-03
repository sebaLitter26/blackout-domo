import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewChildren } from '@angular/core';
import { PanelDataComponent, ProcessStatus, ProcessStatusLabelPosition, ProcessStatusOrientation, ProcessStep } from './index';
// @ts-ignore
//import { hexToCSSFilter, HexToCssConfiguration } from 'hex-to-css-filter';
import { MatMenuTrigger } from '@angular/material/menu';
import { ViewportScroller } from '@angular/common';
import { PanelDataDirective } from './directives/panel-data.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { PanelDataDialogComponent } from './panel-data-dialog/panel-data-dialog.component';


const HEX_VOID_COLOR: string = "#bdbdbd";
const HEX_WIP_COLOR: string = "#4caf50";
const HEX_OK_COLOR: string = "#4caf50";
const HEX_NOK_COLOR: string = "#f44336";
/*
const config: HexToCssConfiguration = {
    acceptanceLossPercentage: 1,
    maxChecks: 10,
};
*/
const FILTER_VOID_COLOR = 'invert(88%) sepia(0%) saturate(0%) hue-rotate(168deg) brightness(90%) contrast(83%);'; //hexToCSSFilter(HEX_VOID_COLOR, config);
const FILTER_WIP_COLOR = 'invert(77%) sepia(16%) saturate(4039%) hue-rotate(66deg) brightness(86%) contrast(57%);'; //hexToCSSFilter(HEX_WIP_COLOR, config);
const FILTER_OK_COLOR = 'invert(77%) sepia(16%) saturate(4039%) hue-rotate(66deg) brightness(86%) contrast(57%);'; //hexToCSSFilter(HEX_OK_COLOR, config);
const FILTER_NOK_COLOR = 'invert(35%) sepia(88%) saturate(2002%) hue-rotate(339deg) brightness(95%) contrast(101%);'; //hexToCSSFilter(HEX_NOK_COLOR, config);
const IMAGE_FILTER = 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(322deg) brightness(104%) contrast(107%);';

@Component({
    selector: 'app-process-status',
    templateUrl: './process-status.component.html',
    styleUrls: ['./process-status.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({maxHeight: '0px', width: '100%'})),
            state('expanded', style({maxHeight: '550px', width: '100%'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ProcessStatusComponent implements OnInit, OnDestroy {

    /**
     * ID único para identificar unívocamente un proceso. Debe proveerse si se desea utilizar el contenedor dinámico de los pasos,
     * ya que de no proveerse, podría generar conflictos al tener más de una instancia de este componente.
     */
    @Input()
    uniqueId: string = "";
    /** El listado de pasos que definen el proceso. */
    @Input()
    steps: ProcessStep[] = [];
    /** El ancho de los conectores de cada paso. */
    @Input()
    connectorWidth: number = 24;
    /** Componentes a renderizar a modo detalle cuando se clickea un paso dentro del proceso.*/
    @Input()
    panelComponents: Type<any>[] = [];
    /** Define la orientación del stepper. Por default es `horizontal`.*/
    @Input()
    orientation: ProcessStatusOrientation = "horizontal";
    /** Flag que indica si deben usarse labels para cada Step. */
    @Input()
    useLabels: boolean = false;
    /** Flag que indica si deben usarse labels secundarios para cada Step. */
    @Input()
    useSecondaryLabels: boolean = false;
    /** Define la posición del label del step. Por default toma el valor `after`. */
    @Input()
    labelPosition: ProcessStatusLabelPosition = "after";
    /** Flag que indica si se debe scrollear al panel de detalles automáticamente. */
    @Input()
    useAutoScroll: boolean = true;

    /** Emisor de evento que se dispara cuando se hace click sobre algún paso. */
    @Output()
    onClickEvent: EventEmitter<ProcessStep> = new EventEmitter();

    /** Referencia al `MatMenuTrigger` */
    @ViewChild(MatMenuTrigger, { static: false })
    private menu_?: MatMenuTrigger;
    /** Referencia al `PanelDataDirective` */
    @ViewChildren(PanelDataDirective)
    private panelDataDirectiveQueryList_?: QueryList<PanelDataDirective>;

    /** Mapeo de estilos a cada estado y proceso. */
    styleStatusMap: { [ keys in ProcessStatus ]: { [key: string ] : { [key: string] : string } } } = {
        "VOID": {
            "image" : {
                "filter": this.getFilterColor_(FILTER_VOID_COLOR),
            },
            "image-container": {
                "border-color": HEX_VOID_COLOR,
            },
            "panel": {
                "border-color": HEX_VOID_COLOR,
            },
        },
        "WIP": {
            "connector-left": {
                "background-color": HEX_WIP_COLOR,
            },
            "image-container": {
                "border-left-color": HEX_WIP_COLOR,
                "border-top-color": HEX_WIP_COLOR,
                "-webkit-transform": "rotate(-45deg)",
            },
            "image": {
                "filter": this.getFilterColor_(FILTER_OK_COLOR),
                "-webkit-transform": "rotate(45deg)",
                "animation": "tilt 0.5s linear infinite alternate",
            },
            "panel": {
                "border-color": HEX_VOID_COLOR,
            },
        },
        "OK": {
            "connector-left": {
                "background-color": HEX_OK_COLOR,
            },
            "image-container": {
                "border-color": HEX_OK_COLOR,
                "background-color": HEX_OK_COLOR,
            },
            "image": {
                "filter": this.getFilterColor_(IMAGE_FILTER),
            },
            "connector-right": {
                "background-color": HEX_OK_COLOR,
            },
            "panel": {
                "border-color": HEX_OK_COLOR,
            },
        },
        "NOK": {
            "connector-left": {
                "background-color": HEX_NOK_COLOR,
            },
            "image-container": {
                "border-color": HEX_NOK_COLOR,
                "background-color": HEX_NOK_COLOR,
            },
            "image": {
                "filter": this.getFilterColor_(IMAGE_FILTER),
            },
            "connector-right": {
                "background-color": HEX_NOK_COLOR,
            },
            "panel": {
                "border-color": HEX_NOK_COLOR,
            },
        }
    }

    stylePanelPosition: { [key: string ]: string } = {}

    /** El panel de detalles que se muestra actualmente. */
    displayedPanel: string | null | undefined = null;


    overlayOpen: boolean = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private viewportScroller: ViewportScroller,
        //private componentFactoryResolver: ComponentFactoryResolver,
        private matDialog: MatDialog,
    ) {}

    ngOnInit(): void {
        for (let step of this.steps) {
            step.processStepId = `step-${step.processId}-${this.uniqueId}`;
        }
    }

    ngOnDestroy(): void {

    }

    /**
     * Manejador de evento click en step del proceso.
     * @param $event el evento click
     * @param stepIndex el índice posicional del paso clickeado
     */
    handleStepClick($event: MouseEvent, step: ProcessStep, index: number): void {
        if (step.onClick) {
            step.onClick(step.processData);
        }

        this.overlayOpen = !this.overlayOpen;

        // Por el momento, el panel expansible de detalles sólo está soportado en modo vertical :(
        if (step.processData && this.orientation == 'vertical') {
             // Si el panel mostrado es el mismo que se clickeó, oculto el panel. Caso contrario, muestro el nuevo panel.
            this.displayedPanel = this.displayedPanel == step.processStepId ? null : step.processStepId;

            // Renderizo el componente de detalle correspondiente al paso clickeado
            if (this.panelComponents[index]) {
                let currentIndex: number = 0;
                let itemDetailHost: PanelDataDirective | undefined = this.panelDataDirectiveQueryList_?.first;

                // Busco la directiva correspondiente al elemento que se acaba de expandir
                this.panelDataDirectiveQueryList_?.forEach(item => {
                    if (currentIndex == index ) {
                        itemDetailHost = item;
                    }

                    currentIndex++;
                });


                if(itemDetailHost) {
                    //const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.panelComponents[index]);

                    const viewContainerRef = itemDetailHost.viewContainerRef;
                    viewContainerRef.clear();

                    const componentRef = viewContainerRef.createComponent<PanelDataComponent>(this.panelComponents[index]);
                    componentRef.instance.data = step.processData;
                }


            }

            if (this.useAutoScroll && this.displayedPanel) {
                setTimeout(() => {
                    this.viewportScroller.setOffset([0, 75]);
                    this.viewportScroller.scrollToAnchor(`dp-${step.processStepId}`);
                }, 10);
            }
        } else {
            this.matDialog.open(PanelDataDialogComponent, {
                width: "1200px",
                data: {
                    data: step.processData,
                    componentType: this.panelComponents[index],
                },
                panelClass: "no-padding-panel",
            });
        }

        // Emito el paso que se clickeó al componente padre para que realice su propia lógica.
        this.onClickEvent.emit(step);
    }

    /**
     * TODO:
     * Handler para cuando se cierra el menú contextual del paso.
     */
    onMenuClosed(): void {
        let menu = document.getElementById('menuClick');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    /**
     * TODO:
     * Define la posición del menú contextual del item sobre el que se hizo click
     * @param $event el evento click
     */
    private setMenuPosition_($event: MouseEvent): void {
        let menuClick = document.getElementById("stepDialog");

        if(menuClick && this.menu_) {
            menuClick.style.display = '';
            menuClick.style.position = 'fixed';
            menuClick.style.left = $event.x + 5 + 'px';
            menuClick.style.top = $event.y + 5 + 'px';

            this.menu_.openMenu();
        }
    }

    private getFilterColor_(filterColor: any): string {
        return (<string>filterColor.filter).replace(";", "");
    }
}