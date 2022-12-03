import { NgModule, Type } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { DynamicTableModule } from "../../ui/dynamic-table/dynamic-table.module";
import { DynamicTableColumnMenuComponent } from "./dynamic-table-column-menu/dynamic-table-column-menu.component";

const components: Type<any> [] = [
    DynamicTableColumnMenuComponent,
];

@NgModule({
    imports: [
        SharedModule,
        DynamicTableModule,
    ],
    declarations: components,
    exports: components,
})
export class DynamicTableColumnMenuModule {}