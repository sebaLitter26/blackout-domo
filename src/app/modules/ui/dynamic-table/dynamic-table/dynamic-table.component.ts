import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewportScroller } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, Type, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { NavbarService } from '../../../navbar/services/navbar.service';
import { HashService } from '../../../../services/hash.service';
import { MathService } from '../../../../services/math.service';
import { UtilsService } from '../../../../services/utils.service';
import { CustomCellDirective } from '../directives/custom-cell.directive';
import { ItemDetailDirective } from '../directives/item-detail.directive';
import { DynamicComponent, CustomCellComponent, DynamicTableDefinition, DynamicTableGroupingHeader, DynamicTableSearchItem, ItemDetailComponent } from '..';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { of } from 'rxjs';

type SortingOrder = "asc" | "desc";

/** Un campo filtrable en `DynamicTableComponent`. */
interface ActiveFilter {
    filter: string;
    value: string;
    columnPosition: number;

}

/** Un campo ordenable en `DynamicTableComponent`. */
interface ActiveSort {
    sortBy: number;
    value: SortingOrder;
}

/** Mapeo de posición del scroll de la tabla y el mouse. */
interface ScrollPosition {
    // Posición actual del scroll
    left: number;
    top: number;
    // Posición actual del mouse
    x: number;
    y: number;
}

/** Diferencia de tiempo en milisegundos entre que se presiona y se suelta el clic del mouse para definir si es un clic válido o no. */
const VALID_CLICK_MS: number = 175;

/** Valor de la sombra izquierda que indica overflow del lado izquierdo de la tabla */
// const LEFT_HIGHLIGHT: string = "inset 41px 2px 41px -36px rgb(189, 189, 189)";
/** Valor de la sombra derecha que indica overflow del lado derecho de la tabla */
// const RIGHT_HIGHLIGHT: string = "inset -41px 2px 41px -36px rgb(189, 189, 189)";

const LEFT_HIGHLIGHT: string = "";
const RIGHT_HIGHLIGHT: string = "";

/**
 * Componente de tabla dinámica que puede usarse para tabular cualquier estructura de objetos (excepto campos del tipo `array`).
 *
 * Se dispone de una opción que permite filtrar por cualquier campo de la tabla.
 *
 * No se pueden tabular objetos anidados**.
 *
 * ** Una solución recomendada es el uso del flag `expandableRows` para permitir la expansión de filas y mostrar detalles. Se deberá
 * inyectar el componente a mostrar dentro del espacio generado por la fila al expandirse.
 */
@Component({
    selector: 'app-dynamic-table',
    templateUrl: './dynamic-table.component.html',
    styleUrls: ['./dynamic-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
        trigger('hoverExpand', [
            state('collapsed', style({width: '0px', minWidth: '0', opacity: '0'})),
            state('expanded', style({width: '75px', opacity: '1'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
        trigger('rotate', [
            state('right', style({ transform: 'rotate(0deg)'})),
            state('bottom', style({ transform: 'rotate(90deg)'})),
            transition('right <=> bottom', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class DynamicTableComponent implements OnInit, AfterViewInit, OnDestroy {

    /** El `array` de objetos a tabular. */
    @Input()
    data: any[] = [];
    /**
     * Definición de la estructura de la tabla.
     *
     * Si no se define, por defecto se tabula el objeto completo.
     */
    @Input()
    tableDefinition: DynamicTableDefinition = {
        displayedColumns: [],
        headerCellDefinitions: [],
    };
    /** El color de fondo de la tabla. */
    @Input()
    backgroundColor: string = "var(--color-card-background)";
    /** El radio de los bordes de la tabla. */
    @Input()
    borderRadius: string = "0px";
    /** El ancho del borde de la tabla. */
    @Input()
    borderWidth: string = "0px";
    /** El color del borde de la tabla. */
    @Input()
    borderColor: string = "var(--color-border)";
    /** Flag que indica si la tabla tiene filas expansibles. */
    @Input()
    expandableRows: boolean = false;
    /** Componente a utilizar para mostrar los detalles de los items de la tabla. */
    @Input()
    itemDetailComponent: Type<any> | null = null;
    /** Icono al mostrar cuando se apoya el mouse sobre una fila */
    @Input()
    hoverIcon: string = "";
    /** Mensaje a mostrar cuando se apoya el mouse sobre una fila */
    @Input()
    hoverMessage: string = "";
    /** Dropshadow de la tabla */
    @Input()
    elevationClass: string = "mat-elevation-z0";
    /** Flag que indica si la tabla debe utilizar una fila de filtros. */
    @Input()
    useFilters: boolean = false;
    /** Flag que indica si la opción de filtros está activada por defecto. */
    @Input()
    useFiltersDefaultActive: boolean = false;
    /** 
     * Flag que indica si se debe habilitar autocompletado en los filtros.
     * 
     * El valor por default es `false`.
     */
    @Input()
    useAutoComplete: boolean = false;
    /** Flag que indica si debe usarse paginación en la tabla. */
    @Input()
    usePagination: boolean = false;
    /** Tamaño de las páginas de la tabla. */
    @Input()
    pageSize: number = 10;
    /** Flag que indica si debe usarse ordenamiento. */
    @Input()
    useSorting: boolean = false;
    /** Estilos a utilizar para cada columna. */
    @Input()
    columnStyles: (((item: any) => {[key: string]: string}) | null)[] = [];
    /** Evento que emite los valores filtrados del dataset. El evento se dispara al aplicar cualquier filtro. */
    @Output()
    dataFilterEvent: EventEmitter<any> = new EventEmitter<any>();
    /**
     * `Observable` que emite eventos de búsqueda en el componente padre.
     *
     * Está pensado para usarse en conjunto con la opción `expandableRows` para expandir detalles de un registro buscado en el componente padre.
     *
     * En otras palabras, funciona a modo de clic virtual de una determinada fila de la tabla.
     */
    @Input()
    searchSource: Observable<DynamicTableSearchItem[]> | null = null;
    /**
     * `Observable` que emite eventos de actualización del `data`.
     *
     * Está pensado para forzar actualizaciones del `MatTableDataSource` de la tabla, desde el componente padre.
     */
    @Input()
    updateSource: Observable<boolean> | null = null;
    /**
     * Componentes custom a renderizar para cada columna.
     *
     * Permite inyectar componentes customizados en las celdas de una columna en particular. Se utiliza para los casos
     * en los que se necesita agregar más información al dato a mostrar en una columna.
     *
     * Para los casos en los que solo se requiera cambiar el formato de un dato, se prefiere el uso de `columnFormaters`.
    */
    @Input()
    customColumnComponents: (Type<CustomCellComponent> | DynamicComponent | null)[] = [];
    /** El alto de la fila con los headers de la tabla. */
    @Input()
    headerHeight: number = 56;
    /** El alto de una fila de la tabla. */
    @Input()
    rowHeight: number = 48;
    /** El tamaño de fuente de las filas de datos. */
    @Input()
    fontSize: number = 12;
    /** Flag que indica si se pueden arrastrar y soltar filas. */
    @Input()
    useDrag: boolean = false;
    /** Flag que indica si se debe usar handle para el drag de filas. */
    @Input()
    dragHandle: boolean = false;
    /** Evento disparado cuando se arrastra y se suelta una fila, si `useDrag` está habilitado. */
    @Output()
    dropEvent: EventEmitter<any> = new EventEmitter<any>();
    /** Flag que indica si se debe permitir la selección de filas. */
    @Input()
    useSelection: boolean = false;
    /** Flag que indica si se permite la selección de todas las filas de la tabla. */
    @Input()
    allowSelectAll: boolean = true;
    /** Flag que indica si se debe realizar la selección de todas las filas de la tabla al momento de ser renderizada. */
    @Input()
    selectAllAtStart: boolean = false;
    /**
     * `Observable` que emite un valor cuando es necesario limpiar la selección actual de filas, en caso de que esté activado el flag `useSelection`.
     *
     * Está pensado para cuando haga falta forzar la limpieza de la selección actual desde el componente padre.
     */
    @Input()
    clearSelectionSource: Observable<boolean> | null = null;
    /** Función de validación para verificar si se debe deshabilitar la selección de una fila. */
    @Input()
    selectionDisabledCallback: ((row: any) => boolean) | null = null;
    /**
     * Función que verifica que filas deben tener una selección forzada.
     * 
     * Esto permite que, por más que la fila tenga deshabilitada la selección a través de `selectionDisabledCallback`,
     * la misma pueda quedar seleccionada en un estado deshabilitado.
     */
    @Input()
    forceSelectionCallback: ((row: any) => boolean) | null = null;
    /**
     * Evento disparado cuando se selecciona una fila en caso de que `useSelection` esté habilitado.
     *
     * Emite todas las filas seleccionadas actualmente.
    */
    @Output()
    selectionEvent: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Evento disparado cuando se selecciona una fila en caso de que `useSelection` esté habilitado.
     *
     * Emite la última fila seleccionada.
    */
    @Output()
    lastSelectionEvent: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Header de agrupamiento. Sirve para agrupar columnas en un header secundario.
     */
    @Input()
    groupingHeader: DynamicTableGroupingHeader = {
        columnNames: [],
        columnSpans: [],
    };

    /** El alto del header de agrupamiento. */
    @Input()
    groupingHeaderHeight: number = 56;

    /**
     * Flag que indica si se debe usar un highlight cuando se produce un overflow en el scrolling de la tabla en dirección horizontal.
     */
    @Input()
    useScrollHighlight: boolean = true;

    /**
     * TODO: no anda
     * Posición a usar como sticky para los headers. En caso de que sea `null`, no se usa posición sticky.
     */
    @Input()
    stickyTopPosition: string | null = null;

    /** Ancho máximo que puede ocupar una celda de la tabla. */
    @Input()
    cellsMaxWidth: string | null = null;

    /**
     * Arreglo de funciones que formatean el dato de una columna en particular.
     *
     * Se utiliza para los casos en los que la propiedad a mostrarse de un objeto no coincide con el dato recibido, sino
     * que responde a otro formato. Por ejemplo, la fecha recibida en una propiedad puede necesitar mostrarse
     * en un formato diferente.
     *
     * Se prefiere el uso de esta propiedad para estos casos por sobre los `customColumnComponents`.
     */
    @Input()
    columnFormaters: (((item: any) => string | number | boolean) | null)[] = [];

    @Input()
    notFilteredColumns: number[] = [];

    /** El callback a ejectuar una vez que se haga click sobre una fila. */
    @Input()
    onRowClickCallback: ((item: any) => void) | null = null;

    displayedColumns: string[] = []

    headerCellDefinitions: string[] = [];

    /** El `MatTableDataSource` con la información a tabular. */
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    /** El item que actualemte se encuentra expandido. */
    expandedItem: any;
    /** El item que actualmente se encuentra hovereado */
    hoverItem: any;
    /** Indica si los filtros de la tabla están activos. */
    _filtersActive: boolean = false;
    /** Último valor ingresado en cualquier filtro de la tabla. */
    lastFilterValue: any = "";
    /** Paginador de la tabla. */
    @ViewChild(MatPaginator)
    paginator: MatPaginator | null = null;

    /** ID generado aleatoriamente para los nodos de la tabla. */
    randomId: number = 0;

    /** `Subscription` de `searchSource`. */
    searchSubscription: Subscription | null = null;

    filteredOptions: Observable<string[]> = of([]);

    /** La posición actual del scroll de la tabla y el mouse. */
    private _currentScrollPosition: ScrollPosition | null = null;
    /** Filtros activos actualmente. */
    private _activeFilters: ActiveFilter[] = [];
    /** Ordenamientos activos actualmente. */
    _activeSorts: ActiveSort[] = [];
    /** Flag que indica que el mouse está presionado. */
    private _mouseDown: boolean = false;
    /** El tiempo en ms en el que se presionó el mouse. */
    private _mouseDownTime: number = 0;
    /** El tiempo en ms en el que se levantó el mouse. */
    private _mouseUpTime: number = 0;
    /** Data actual filtrada y ordenada de acuerdo al estado actual de la tabla. */
    private _filteredOrderedData: any[] = [];
    /** Referencia al host de detalles de filas. */
    @ViewChildren(ItemDetailDirective)
    private _itemDetailDirectiveQueryList: QueryList<ItemDetailDirective> | null = null;
    /** Referencia al host de componentes custom para celdas de una columna. */
    @ViewChildren(CustomCellDirective)
    private _customCellDirectiveQueryList: QueryList<CustomCellDirective> | null = null;

    /** Listado de filas que se encuentran seleccionadas. */
    private _selectedRows: any[] = [];

    _allRowsSelected: boolean = false;

    /** Listado de `MatCheckbox` de cada fila, cuando `useSelection` está activado. */
    @ViewChildren(MatCheckbox)
    private _rowSelections: QueryList<MatCheckbox> | null = null;

    dragDisabled: boolean = true;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        public utilsService: UtilsService,
        private navbarService: NavbarService,
        private mathService: MathService,
        private viewportScroller: ViewportScroller,
        private changeDetectorRef: ChangeDetectorRef,
        private hashService: HashService,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.randomId = this.mathService.randBetween(1, 1000000);

        this.displayedColumns = [...this.tableDefinition.displayedColumns];
        this.headerCellDefinitions = [...this.tableDefinition.headerCellDefinitions];

        if (!this.displayedColumns || !this.displayedColumns.length) {
            this.__initDisplayedColumns__();
        }

        if (!this.headerCellDefinitions || !this.headerCellDefinitions.length) {
            this.__initHeaderCellDefinitions__();
        }

        if (this.expandableRows) {
            this.displayedColumns.unshift("chevron");
            this.headerCellDefinitions.unshift("");
        }

        if (this.useFilters) {
            this.displayedColumns.push("filters");
            this.headerCellDefinitions.push("");

            this._filtersActive = this.useFiltersDefaultActive;
        }

        if (this.useSelection) {
            this.displayedColumns.push("selection");
            this.headerCellDefinitions.push("");
        }

        if (this.dragHandle) {
            this.displayedColumns.push("handle");
            this.headerCellDefinitions.push("");
        }

        if(this.selectAllAtStart) {
            this.updateAllRows(null, true);
        }

        if (this.searchSource) {
            this.searchSubscription = this.searchSource.subscribe((newValues: DynamicTableSearchItem[]) => {
                let rows: any = this.dataSource?.data;

                for (let search of newValues) {
                    rows = rows.filter((_row: { [x: string]: string | number; }) => _row[search.column] == search.value);
                }

                if (rows[0] && this.expandedItem != rows[0]) {
                    this.__onRowClick__(rows[0]);

                    setTimeout(() => {
                        this.viewportScroller.scrollToAnchor(this.__getRowId__(rows[0]));
                    }, 100);
                }
            });
        }

        // Si se recibe una notificación para actualizar la tabla, se actualiza el DataSource
        if (this.updateSource) {
            this.updateSource.subscribe((update) => {
                this.dataSource = new MatTableDataSource<any>(this.data);
                if (this.paginator) {
                    this.dataSource.paginator = this.paginator;
                }


                // Si la selección múltiple está activada, limpio la selección actual
                if (this.useSelection) {
                    this._allRowsSelected = false;

                    this._selectedRows = [];

                    this.selectionEvent.emit(this._selectedRows);
                }

                if(this.selectAllAtStart) {
                    this.updateAllRows(null);
                }

                if (this.useSorting) {
                    this._activeSorts = [];
                    this.__applyFilterSort__();
                }

                setTimeout(() => {
                    this.__loadCustomCellComponents__();
                }, 100);
            });
        }

        if (this.clearSelectionSource) {
            this.clearSelectionSource.subscribe((clearSelection) => {
                this._allRowsSelected = true;
                this.updateAllRows(null);

                this._rowSelections?.forEach(checkbox => {
                    checkbox.checked = false;
                });
            });
        }
    }

    ngAfterViewInit(): void {
        const tableContainer: HTMLElement = <HTMLElement>document.getElementById(`table-container-${this.randomId}`);
        const scrollHighlight: HTMLElement = <HTMLElement>document.getElementById(`scroll-highlight-${this.randomId}`);
        const table: HTMLElement = <HTMLElement>document.getElementById(`table-${this.randomId}`);

        /** Setea el valor actual de la sombra que indica overflow en la tabla. */
        const _setScrollHighlight: () => void = () => {
            const _isScrolledToRight: boolean = (tableContainer.scrollLeft + tableContainer.clientWidth) == table.clientWidth;
            const _isScrolledToLeft: boolean = tableContainer.scrollLeft == 0;
            const _bothHighLights: string = `${LEFT_HIGHLIGHT}, ${RIGHT_HIGHLIGHT}`;

            if (table.clientWidth > tableContainer.clientWidth) {
                if (_isScrolledToRight) {
                    scrollHighlight.style.boxShadow = LEFT_HIGHLIGHT;
                } else {
                    if (_isScrolledToLeft) {
                        scrollHighlight.style.boxShadow = RIGHT_HIGHLIGHT;
                    } else {
                        scrollHighlight.style.boxShadow = _bothHighLights;
                    }
                }
            } else {
                scrollHighlight.style.boxShadow = "";
            }
        }

        if (this.paginator && this.dataSource) {
            this.dataSource.paginator = this.paginator;
        }

        if (tableContainer && scrollHighlight && table) {
            _setScrollHighlight();

            fromEvent(tableContainer, "scroll").subscribe((event) => {
                _setScrollHighlight();
            });

            fromEvent(tableContainer, "mousedown").subscribe((event: Event) => {
                document.getSelection()?.removeAllRanges();

                this._mouseDownTime = Date.now();
                // Se setea la posición actual del scroll y el mouse
                this._currentScrollPosition = {
                    left: tableContainer.scrollLeft,
                    top: tableContainer.scrollTop,
                    x: (<MouseEvent>event).clientX,
                    y: (<MouseEvent>event).clientY,
                }

                this._mouseDown = true;
            });

            fromEvent(tableContainer, "mousemove").subscribe((event: Event) => {
                if (this._currentScrollPosition && this._mouseDown) {
                    // Se calcula cuánto se movió el mouse
                    const dx = (<MouseEvent>event).clientX - this._currentScrollPosition.x;
                    const dy = (<MouseEvent>event).clientY - this._currentScrollPosition.y;

                    // Se scrollea el contenedor de la tabla
                    tableContainer.scrollTop = this._currentScrollPosition.top - dy;
                    tableContainer.scrollLeft = this._currentScrollPosition.left - dx;
                }
            });

            fromEvent(tableContainer, "mouseup").subscribe((event: Event) => {
                this._mouseUpTime = Date.now();

                tableContainer.style.removeProperty('user-select');

                this._mouseDown = false;
            });

            fromEvent(tableContainer, "mouseenter").subscribe((event: Event) => {
                this._mouseDown = false;
            });

            // Si se redimensiona la ventana, actualizo el highlight de la tabla
            fromEvent(window, 'resize').subscribe((event: Event) => {
                setTimeout(() => {
                    _setScrollHighlight();
                }, 100);
            });

            // Si se cambia la orientación de la ventana, actualizo el highlight de la tabla
            fromEvent(window, 'orientationchange').subscribe((event: Event) => {
                setTimeout(() => {
                    _setScrollHighlight();
                }, 100);
            });

            this.navbarService.toggleEvent.subscribe((toggle: boolean) => {
                setTimeout(() => {
                    _setScrollHighlight();
                }, 400);
            });
        }

        setTimeout(() => {
            this.__loadCustomCellComponents__();
        }, 100)
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    /**
     * Actualiza el estado de selección de todas las filas.
     * @param $event el evento de selección
     */
    updateAllRows($event: MatCheckboxChange | null, autoSelect: boolean = false): void {
        this._allRowsSelected = !this._allRowsSelected;

        this._selectedRows = [];

        if (this._allRowsSelected) {
            for (let row of this.dataSource.data) {
                if (this.selectionDisabledCallback) {
                    if (!this.selectionDisabledCallback(row) || autoSelect) {
                        this._selectedRows.push(row);
                    }
                } else {
                    this._selectedRows.push(row);
                }
            }
        }

        // Ciclo para filas que tengan su selección forzada
        for (let row of this.dataSource.data) {
            if (this.forceSelectionCallback != null && this.forceSelectionCallback(row) && !this._selectedRows.includes(row)) {
                this._selectedRows.push(row);
            }
        }

        this.selectionEvent.emit(this._selectedRows);
    }

    /**
     * Actualiza el estado de selección de una fila específica.
     * @param $event el evento de selección
     * @param row la fila
     */
    updateRow($event: MatCheckboxChange, row: any): void {
        if ($event.checked) {
            this._selectedRows.push(row);
        } else {
            this._selectedRows.splice(this._selectedRows.findIndex(_row => _row == row), 1);
        }

        this.selectionEvent.emit(this._selectedRows);
        this.lastSelectionEvent.emit(row);
    }

    /**
     * Verifica si todas las filas están deshabilitadas para su selección.
     * @returns `true` en caso de que todas las filas estén deshabilitadas, `false` en caso contrario
     */
    allRowsAreDisabled(): boolean {
        if (!this.selectionDisabledCallback) {
            return false;
        }

        let disabled: boolean = true;

        for (let row of this.dataSource.data) {
            disabled = this.selectionDisabledCallback(row);

            if (!disabled) {
                break;
            }
        }

        return disabled;
    }

    /**
     * Handler que se activa cuando se dispara el evento de drop de una fila, si `useDrag` está activado.
     * @param event el evento
     */
    drop(event: CdkDragDrop<any>) {
        moveItemInArray(this.data, event.previousIndex, event.currentIndex);

        this.dataSource = new MatTableDataSource<any>(this.data);

        if (event.previousIndex != event.currentIndex) {
            let row = event.item.element.nativeElement;
            this.renderer.addClass(row, 'wild');
            setTimeout(() => this.renderer.removeClass(row, 'wild'), 2000);
        }

        this.dropEvent.emit({
            currentElement: this.data[event.currentIndex],
            oldElementIndex: event.previousIndex,
            oldData: this.data,
            currentElementIndex: event.currentIndex,
        });
    }

    handlePageEvent(): void {
        setTimeout(() => {
            this.__loadCustomCellComponents__();
        }, 10);

        setTimeout(() => {
            this.viewportScroller.setOffset([0, 75]);
            this.viewportScroller.scrollToAnchor("paginator");
        }, 100);
    }

    /**
     * Maneja el evento click en la fila.
     * @param row la  fila en la cual se hizo click
     */
    __onRowClick__(row: any): void {
        // Se considera como click válido una diferencia de cierta cantidad de ms entre que se presiona y se levanta el clic del mouse
        // Esto es para evitar que se abran filas o se dispare el callback de clic en fila cuando se intenta scrollear la tabla
        if ((this._mouseUpTime - this._mouseDownTime) <= VALID_CLICK_MS) {
            // Si el usuario seteó un callback custom a ejecutar luego de hacer click en una fila, se ejecuta el callback
            if (this.onRowClickCallback) {
                this.onRowClickCallback(row);
            }

            if (this.expandableRows) {
                this.expandedItem = this.expandedItem === row ? null : row;
                if (this.expandedItem) {
                    this.__loadItemDetailComponent__(row);
                }
            }
        }
    }

    __onRowEnter__(row: any): void {
        if (this.hoverMessage || this.hoverIcon) {
            this.hoverItem = row;
        }
    }

    /**
     * Activa o desactiva los filtros.
     */
    toggleFilters(): void {
        this._filtersActive = !this._filtersActive;

        if (!this._filtersActive) {
            this.dataSource = new MatTableDataSource<any>(this.data);
            
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }

            this.dataFilterEvent.emit(this.data);

            return;
        }

        this._filteredOrderedData = [...this.data];
    }

    /**
     * Función para manejar el cambio de los filtros de la tabla.
     * @param $event el nuevo valor
     * @param column la columna filtrada
     */
    __onFilterChange__($event: any, column: string, index: number): void {
        let currentIndex: number = this._activeFilters.findIndex(activeFilter => activeFilter.filter == column);

        // Guardo / actualizo el filtro actual
        if (currentIndex < 0) {
            if ($event) {
                this._activeFilters.push({
                    filter: column,
                    value: $event,
                    columnPosition: index
                });
            }
        } else {
            if ($event) {
                this._activeFilters[currentIndex].value = $event;
                
                this.fillFilterValues(column, index, $event);
            } else {
                this._activeFilters.splice(currentIndex, 1);
            }
        }
        
        // Aplico los filtros y el ordenamiento
        this.__applyFilterSort__();
    }

    // Aplico los filtros y el ordenamiento
    onSelectionFilter(column: string, event: string = '') {
        if (event){
            let currentIndex: number = this._activeFilters.findIndex(activeFilter => activeFilter.filter == column);
            this._activeFilters[currentIndex].value = this.lastFilterValue;
        }  
        this.__applyFilterSort__();
    }

    // Cargo los filtros correspondientes a la columna
    fillFilterValues(column: string, index: number, value: string = ''){
        this.filteredOptions =  of([...new Set(this._filter(value, column).map(element => this.columnFormaters[index] ? this.columnFormaters[index]!(element) : (this.utilsService.getObjectType(element[column]) == "primitive" ? element[column] : '')))]);
        //this.filteredOptions =  of([...new Set(this._filter(value, column).map(element =>  element[column]))]);
        
    }

    private _filter(value: string = '', key: string): any[] {
        const filterValue = value.toLowerCase();
        return this._filteredOrderedData.filter(option => option[key] && option[key].toString().toLowerCase().includes(filterValue));
    }

    /**
     * Función para manejar el cambio de ordenamiento en la tabla.
     * @param column el nombre de la columna por cual ordenar
     */
    __onSortChange__(columnIndex: number): void {
        if (this.useSorting) {
            let currentIndex: number = this._getSortIndex(columnIndex);

            // Guardo / actualizo el orden actual
            if (currentIndex < 0) {
                this._activeSorts.push({
                    sortBy: columnIndex,
                    value: 'asc',
                });
            } else {
                if (this._activeSorts[currentIndex].value == 'asc') {
                   this._activeSorts[currentIndex].value = 'desc';
                } else {
                    this._activeSorts.splice(currentIndex, 1);
                }
            }

            // Aplico los filtros y el ordenamiento
            this.__applyFilterSort__();
        }
    }

    /**
     * Devuelve el índice actual del ordenamiento activo para una columna dada.
     * @param columnIndex el indice de la columna
     */
    _getSortIndex(columnIndex: number): number {
        return this._activeSorts.findIndex(activeSort => activeSort.sortBy == columnIndex);
    }

    /**
     * Aplico los filtros actuales a la tabla.
     */
    private __applyFilters__(): void {
        for (let filter of this._activeFilters) {
            if (filter.value.charAt(0) == "<" || filter.value.charAt(0) == ">" || filter.value.charAt(0) == "=") {
                let operator: string = filter.value.charAt(0);
                let filterValue: number = 0;

                if (filter.value.charAt(1) == '=') {
                    operator += '=';
                }

                filterValue = Number.parseFloat(filter.value.substring(operator.length, filter.value.length));

                if (filterValue) {
                    switch(operator) {
                        case '=': {
                            this._filteredOrderedData =  this._filteredOrderedData.filter(item => item[filter.filter] == filterValue);
                            break;
                        }
                        case '>': {
                            this._filteredOrderedData =  this._filteredOrderedData.filter(item => item[filter.filter] > filterValue);
                            break;
                        }
                        case "<": {
                            this._filteredOrderedData =  this._filteredOrderedData.filter(item => item[filter.filter] < filterValue);
                            break;
                        }
                        case ">=": {
                            this._filteredOrderedData =  this._filteredOrderedData.filter(item => item[filter.filter] >= filterValue);
                            break;
                        }
                        case "<=": {
                            this._filteredOrderedData =  this._filteredOrderedData.filter(item => item[filter.filter] <= filterValue);
                            break;
                        }
                    }
                }
            } else {
                this._filteredOrderedData =  this._filteredOrderedData.filter(item => {
                    const filterData = this.columnFormaters[filter.columnPosition] ? this.columnFormaters[filter.columnPosition]!(item) : (this.utilsService.getObjectType(item[filter.filter]) == "primitive" ? item[filter.filter] : '');
                    return filterData.toString().toLowerCase().includes(filter.value.toLowerCase());
                });
            }
        }
    }

    /**
     * Aplica los ordenamientos actuales a la tabla.
     */
    private __applySort__(): void {
        if (this.useSorting) {
            for (let sort of this._activeSorts) {
                this._filteredOrderedData.sort((a, b) => {
                    const _a: any = a[this.displayedColumns[sort.sortBy]];
                    const _b: any = b[this.displayedColumns[sort.sortBy]];

                    if (sort.value == 'asc') {
                        return <any>(_a > _b) - <any>(_a < _b);
                    }

                    return <any>(_b > _a) - <any>(_b < _a);
                });
            }
        }
    }

    /**
     * Aplica los filtros y el ordenamiento a la tabla.
     */
    private __applyFilterSort__(): void {
        this._filteredOrderedData = [...this.data];

        this.__applyFilters__();
        this.__applySort__();

        this.dataSource = new MatTableDataSource<any>( this._filteredOrderedData);

        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }

        this.dataFilterEvent.emit(this._filteredOrderedData);
    }

    /**
     * Lazy loading del componente para mostrar los detalles de la fila.
     */
    private __loadItemDetailComponent__(row: any): void {
        let currentIndex: number = 0;
        let itemDetailHost: ItemDetailDirective | undefined = this._itemDetailDirectiveQueryList?.first;

        // Obtiene el índice de la fila actual, dependiendo del paginado actual de la tabla
        const getRowIndex: () => number = () => {
            const absoluteIndex: number | undefined = this.dataSource?.data.indexOf(row);
            return this.dataSource.paginator ? absoluteIndex - (this.pageSize * this.dataSource.paginator.pageIndex) : absoluteIndex;
        }

        // Busco la directiva correspondiente al elemento que se acaba de expandir
        this._itemDetailDirectiveQueryList?.forEach(item => {
            if (this.dataSource && currentIndex == getRowIndex()) {
                itemDetailHost = item;
            }

            currentIndex++;
        });

        if (itemDetailHost && this.itemDetailComponent) {
            // Renderizo el componente de detalle correspondiente a la fila clickeada
            //const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemDetailComponent);

            const viewContainerRef = itemDetailHost.viewContainerRef;
            viewContainerRef.clear();

            const componentRef = viewContainerRef.createComponent<ItemDetailComponent>(this.itemDetailComponent);
            componentRef.instance.data = row;

            // Seteo un ID al detalle para scrollear el ViewPort hacia él
            // El ID es un hash generado a partir de la data de la fila clickeada, en formato `string`
            itemDetailHost.viewContainerRef.element.nativeElement["parentNode"].id = this.__getRowId__(row);

            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Carga los componentes custom a mostrar en cada celda.
     */
    private __loadCustomCellComponents__(): void {
        if (this.dataSource) {
            // Obtiene el índice de la fila actual, dependiendo del paginado actual de la tabla
            const getRowIndex: () => number = () => {
                return this.dataSource.paginator ? (this.pageSize * this.dataSource.paginator.pageIndex) : 0;
            }

            // Obtiene el último índice de la página actual
            const getMaxRowIndex: () => number = () => {
                if (this.dataSource?.paginator) {
                    const pagesAmmount: number = Math.ceil(this.dataSource.data.length / this.pageSize);
                    const lastPageItemsAmmount: number = this.dataSource.data.length % this.pageSize;

                    // Si es la última página, y la última página tiene menos elementos que las demás
                    if (this.dataSource.paginator.pageIndex == pagesAmmount - 1 && lastPageItemsAmmount > 0) {
                        return this.pageSize * (this.dataSource.paginator.pageIndex) + lastPageItemsAmmount;
                    }

                    return this.pageSize * (this.dataSource.paginator.pageIndex + 1);
                }

                // Si no hay paginado, se devuelve el largo completo del dataset
                return this.dataSource?.data.length;
            }

            // Índice del componente custom actual
            let columnIndex: number = 0;
            // Índice de la fila actual
            let rowIndex: number = getRowIndex();
            // Índice máximo de la fila
            let maxIndex: number = getMaxRowIndex();
            // Índice de inicio a partir del cual se itera el array de componentes custom
            let _startIndex: number = 0;

            if (this._customCellDirectiveQueryList) {
                this._customCellDirectiveQueryList.forEach((item: CustomCellDirective) => {
                    // Flag que indica si se encontró un componente custom para la columna actual
                    let found: boolean = false;
 
                    while (!found) {
                        if (this.customColumnComponents[columnIndex]) {
                            const columnComponent = this.customColumnComponents[columnIndex];

                            //const componentFactory = this.componentFactoryResolver.resolveComponentFactory((<DynamicComponent>columnComponent).type ?? <Type<CustomCellComponent>>columnComponent);

                            const viewContainerRef = item.viewContainerRef;
                            viewContainerRef.clear();
                            const componentRef = viewContainerRef.createComponent<CustomCellComponent>( (<DynamicComponent>columnComponent).type ?? <Type<CustomCellComponent>>columnComponent);
                        
                            componentRef.instance.data = this.dataSource?.data[rowIndex];

                            if(columnComponent && ('componentData' in columnComponent)) {    
                                componentRef.instance.componentData = columnComponent.componentData;
                            }

                            _startIndex = columnIndex;
                            found = true;
                        } else {
                            columnIndex++;
                        }
                    }

                    rowIndex++;

                    // Al terminar de recorrer la página actual, se vuelve a empezar y se busca el siguiente componente custom
                    if (rowIndex == maxIndex) {
                        rowIndex = getRowIndex();
                        _startIndex++;
                    }

                    columnIndex = _startIndex;
                });
            }

            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Inicializa las columnas a mostrar en la tabla.
     */
    private __initDisplayedColumns__(): void {
        let referenceObject: any = this.data[0];

        for (let key of Object.keys(referenceObject)) {
            this.displayedColumns.push(key);
        }
    }

    /**
     * Inicializa las definiciones de los headers de las columnas a mostrar en la tabla.
     */
    private __initHeaderCellDefinitions__(): void {
        let referenceObject: any = this.data[0];

        for (let key of Object.keys(referenceObject)) {
            this.headerCellDefinitions.push(key);
        }
    }

    /**
     * Devuelve el ID del nodo correspondiente al detalle de una fila.
     * @param row la fila
     */
    private __getRowId__(row: any): string {
        return this.hashService.hash(JSON.stringify(row)).toString();
    }

    /**
     * Asigna la función callback a ejecutar una vez que se haga click en en una fila.
     * @param callback la función callback
     */
    setOnRowClickCallback(callback: (item: any) => void) {
        this.onRowClickCallback = callback;
    }
}
