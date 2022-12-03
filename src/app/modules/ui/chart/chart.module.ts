import { NgModule } from '@angular/core';
import { ChartComponent } from './chart.component';
import { SharedModule } from '../../shared.module';

const components = [
    ChartComponent,
]
@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        ...components
    ],
    exports: [
        ...components
    ]
})
export class ChartModule { }
