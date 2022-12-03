import { NgModule, Type } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { CoolInputModule } from "../cool-input/cool-input.module";
import { DynamicSearchComponent } from "./dynamic-search/dynamic-search.component";

const components: Type<any>[] = [
    DynamicSearchComponent
];

@NgModule({
    imports: [
        SharedModule,
        CoolInputModule,
    ],
    declarations: components,
    exports: components,
})
export class DynamicSearchModule {}