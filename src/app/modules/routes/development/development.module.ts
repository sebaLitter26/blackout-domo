import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared.module";
import { BankCardModule } from "../../ui/bank-card/bank-card.module";
import { CoolCardModule } from "../../ui/cool-card/cool-card.module";
import { CoolFileInputModule } from "../../ui/cool-file-input/cool-file-input.module";
import { CoolInputModule } from "../../ui/cool-input/cool-input.module";
import { RangeSliderModule } from "../../ui/range-slider/range-slider.module";
import { ComponentDebuggingComponent } from './component-debugging/component-debugging.component';
import { ZplComponent } from "./zpl/zpl.component";
import { SnackBarTesterComponent } from './snack-bar-tester/snack-bar-tester.component';
import { DashboardCardModule } from '../../ui/dashboard-card/dashboard-card.module';
import { DynamicSearchModule } from "../../ui/dynamic-search/dynamic-search.module";
const routes: Routes = [
    {
        path: 'component-debugging',
        component: ComponentDebuggingComponent,
    },
    {
        path: 'zpl',
        component: ZplComponent,
    },
    {
        path: 'snackbar-tester',
        component: SnackBarTesterComponent,
    },
    {
        path: '',
        redirectTo: 'component-debugging',
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        BankCardModule,
        RangeSliderModule,
        CoolCardModule,
        ReactiveFormsModule,
        CoolInputModule,
        CoolFileInputModule,
        DashboardCardModule,
        DynamicSearchModule,
    ],
    declarations: [
        ComponentDebuggingComponent,
        ZplComponent,
        SnackBarTesterComponent
    ],
    providers: []
})
export class DevelopmentModule {}