import { NgModule } from '@angular/core';
import { DashboardCardComponent } from './dashboard-card.component';
import { SharedModule } from '../../shared.module';
import { ItemDetailHostDirective } from './directives/item-detail-host.directive';

const components = [
    DashboardCardComponent,
]
@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        ...components,
        ItemDetailHostDirective
    ],
    exports: [
        ...components
    ]
})
export class DashboardCardModule { }
