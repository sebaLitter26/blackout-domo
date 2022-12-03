import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomCellComponent } from 'src/app/modules/ui/dynamic-table';
import { DynamicTableColumnMenuData, DynamicTableColumnMenuOption } from '..';

@Component({
    selector: 'app-dynamic-table-column-menu',
    templateUrl: './dynamic-table-column-menu.component.html',
    styleUrls: ['./dynamic-table-column-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTableColumnMenuComponent implements CustomCellComponent {
    /** Data de la fila actual de la instancia de la `DynamicTableComponent` a la que corresponde este componente. */
    data: any;

    /**
     * Parámetros del menú.
     *
     * Incluye el listado de opciones a renderizar, junto con las funciones a ejecutar para cada opción.
     */
    componentData?: DynamicTableColumnMenuData;

    constructor() {}

    /**
     * Obtiene el icono a mostrar en una opción del menú.
     * @param option la opción del menú
     * @returns el icono de la opción
     */
    getIcon(option: DynamicTableColumnMenuOption): string {
        if (option.icon) {
            return typeof option.icon == 'function'
                ? option.icon(this.data)
                : option.icon;
        }

        return '';
    }

    /**
     * Obtiene la descripción a mostrar en una opción del menú.
     * @param option la opción del menú
     * @returns la descripción de la opción
     */
    getDescription(option: DynamicTableColumnMenuOption): string {
        return typeof option.description == 'function'
            ? option.description(this.data)
            : option.description;
    }
}
