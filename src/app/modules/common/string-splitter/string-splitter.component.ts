import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StringSplitterData } from '..';
import { CustomCellComponent } from '../../ui/dynamic-table';

@Component({
    selector: 'app-string-splitter',
    templateUrl: './string-splitter.component.html',
    styleUrls: ['./string-splitter.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '14px', minHeight: '14px'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringSplitterComponent implements OnInit, CustomCellComponent {

    /** Data de la fila. */
    data: any;
    
    /** Data que contiene el path de la propiedad a mostrar. */
    componentData?: StringSplitterData;

    /** Array con los strings splitteados. */
    strings: string[] = [];

    /** Flag que indica si el contenedor de strings se encuentra colapsado. */
    expanded: boolean = false;

    constructor() { }

    ngOnInit(): void {
        if (this.data) {
            if (!this.componentData?.propertyPath) {
                return;
            }
            this.strings = this.data[this.componentData?.propertyPath!] ?? [];
            
        }
    }

    expand(e:Event): void {
        e.stopPropagation();
        if (this.strings.length > 1) {
            this.expanded = !this.expanded;
        }
    }
}
