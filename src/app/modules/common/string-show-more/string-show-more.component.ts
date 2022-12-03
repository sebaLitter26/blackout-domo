import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StringShowMoreData } from '..';
import { CustomCellComponent } from 'src/app/modules/ui/dynamic-table';

@Component({
    selector: 'string-show-more-app',
    templateUrl: './string-show-more.component.html',
    styleUrls: ['./string-show-more.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '14px', minHeight: '14px'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringShowMore implements OnInit, CustomCellComponent {

    /** Data de la fila. */
    data: any;
        
    /** Data que contiene el path de la propiedad a mostrar. */
    componentData?: StringShowMoreData;

    /** Variables que guardan las 2 partes del string. */
    firstPart: string = "";

    secondPart: string = "";    

    strings: string = '';

    /** Flag que indica si el contenedor de strings se encuentra colapsado. */
    expanded: boolean = false;

    constructor() { }

    ngOnInit(): void {      
            if (this.data && this.componentData && this.componentData?.propertyPath) {
                this.strings = this.data[this.componentData?.propertyPath!] ?? '';
                this.splitString(this.strings);  
            }
    }

    splitString(text: string) {
        this.firstPart = this.strings.substring(0, this.componentData?.maxLength);
        this.secondPart = this.strings.substring(this.componentData?.maxLength! , this.strings.length);
    }

    
    expand(e:Event): void {
        e.stopPropagation();
        if (this.strings.length > this.componentData?.maxLength!) {
            this.expanded = !this.expanded;
        }
    }

    }
