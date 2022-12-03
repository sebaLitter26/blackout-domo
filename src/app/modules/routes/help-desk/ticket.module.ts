import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { DynamicTableModule } from '../../ui/dynamic-table/dynamic-table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoolDirectivesModule } from '../../ui/cool-input/cool-directives/cool-directives.module';
import { CoolInputModule } from '../../ui/cool-input/cool-input.module';
import { AuthorizationModule } from '../../authorization/authorization.module';
import { OrderListComponent } from './ticket-control/order-list.component';
import { DatePipe } from '@angular/common';
import { ProcessStatusModule } from '../../process-status/process-status.module';
import { RoutesCommonModule } from '../../common/routes-common.module';
import { OrdersControlService } from './services/orders-control.service'; 
import { LoadersModule } from "../../ui/loaders/loaders.module";
import { OrderActionsComponent } from './ticket-control/order/order-actions.component';
import { OrderDetailComponent } from './ticket-control/order-detail/order-detail.component';
import { DashboardCardModule } from '../../ui/dashboard-card/dashboard-card.module';
import { OrderDetailResolver } from './resolver/order-detail-resolver';
import { OrderInformationComponent } from './ticket-control/order-information/order-info.component';
import { OrderAmountComponent } from './ticket-control/order-detail/order-amount/order-amount.component';
import { PrintOrderComponent } from './ticket-control/order-detail/print-order/print-order.component';

const routes: Routes = [
    {
        path: 'order-list',
        component: OrderListComponent,
        data: { animation: 'isLeft' } 
    },
    { 
        path: 'order-detail',
        component: OrderDetailComponent,
        resolve: {orderDetail: OrderDetailResolver},
        data: { animation: 'isRight' } 
    },
]
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        DynamicTableModule,
        ReactiveFormsModule,
        CoolDirectivesModule,
        CoolInputModule,
        AuthorizationModule,
        ProcessStatusModule,
        RoutesCommonModule,
        LoadersModule,
        DashboardCardModule,
    ],
    declarations: [
        OrderActionsComponent,
        OrderDetailComponent,
        OrderAmountComponent,
        OrderInformationComponent,
        PrintOrderComponent,
        OrderListComponent
    ],
    providers: [
        DatePipe,
        OrdersControlService,
        OrderDetailResolver
    ]
})
export class TicketModule { }
