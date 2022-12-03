import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';
import { ArrayUtils } from 'src/app/utils/array.utils';
import { DynamicSearchResult } from '..';

@Component({
    selector: 'app-dynamic-search',
    templateUrl: './dynamic-search.component.html',
    styleUrls: ['./dynamic-search.component.scss'],
})
export class DynamicSearchComponent<T> implements OnInit {

    /** Array de objetos con la data a filtrar. */
    @Input()
    data: T[] = [];

    /** 
     * Tiempo de debounce para ingreso por teclado del usuario, en milisegundos.
     * 
     * Por defecto es `1000`.
    */
    @Input()
    debounceTime: number = 1000;

    /** Listado de propiedades a usar para la búsqueda dentro del array `data`. */
    @Input()
    searchProperties: (keyof T)[] = [];

    @Input()
    placeholder: string = "";

    @Input()
    case: 'sensitive' | 'insensitive' = 'insensitive';

    /** El tamaño de la fuente. */
    @Input()
    fontSize: string = "16px";

    /** El tamaño del icono. */
    @Input()
    iconSize: string = "16px";

    /**
     * Evento disparado cuando se cumple el tiempo de `debounceTime` y se filtra el `data` con lo que haya ingresado el usuario.
     * 
     * Emite un array con la data filtrada.
     */
    @Output()
    onFilter: EventEmitter<DynamicSearchResult<T>> = new EventEmitter<DynamicSearchResult<T>>();

    searchControl: FormControl = new FormControl();

    constructor() {}

    ngOnInit(): void {
        this.searchControl.valueChanges.pipe(
            debounceTime(this.debounceTime),
            tap({
                next: (value: string) => {
                    if (!value || value.length == 0) {
                        this.onFilter.next({
                            lastSearch: null,
                            searchResult: this.data,
                        });
                        
                        return;
                    }

                    const trimedValue: string = value.trim();

                    // Intenta filtrar asumiendo que se enviaron propiedades de los objetos
                    const filteredValues: T[][] = this.searchProperties.reduce((acum: T[][], property: keyof T) => {
                        return acum = [...acum, this.data.filter((item: T) => this.case == 'sensitive' ?
                            JSON.stringify(item[property]).includes(trimedValue) : JSON.stringify(item[property]).toLowerCase().includes(trimedValue.toLowerCase()))];
                    }, []);

                    // Si no se recibieron propiedades para usar como filtro, se usa el valor del objeto directamente
                    if (this.searchProperties.length == 0) {
                        filteredValues.push(this.data.filter((item: T) => this.case == 'sensitive' ?
                        JSON.stringify(item).includes(trimedValue) : JSON.stringify(item).toLocaleLowerCase().includes(trimedValue.toLowerCase())));
                    }

                    this.onFilter.next({
                        lastSearch: trimedValue,
                        searchResult: ArrayUtils.mergeWithoutDuplicates(filteredValues),
                    });
                }
            }),
        ).subscribe();
    }
}
