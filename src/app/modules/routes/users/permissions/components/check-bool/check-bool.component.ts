import { Component, OnInit } from '@angular/core';
import { CustomCellComponent } from 'src/app/modules/ui/dynamic-table';
import { Permission } from '../../..';

@Component({
    selector: 'app-check-bool',
    templateUrl: './check-bool.component.html',
    styleUrls: ['./check-bool.component.scss'],
})
export class CheckBoolComponent implements OnInit, CustomCellComponent {
    constructor() {}

    data: Permission | null = null;

    enabled: number | null = null;

    ngOnInit(): void {
        if (this.data?.activo) {
            this.enabled = this.data.activo;
        }
    }
}
