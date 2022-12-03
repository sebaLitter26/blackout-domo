import { NgModule, Type } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { DynamicLinkedListsComponent } from "./dynamic-linked-lists/dynamic-linked-lists.component";

const components: Type<any>[] = [
    DynamicLinkedListsComponent,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: components,
    exports: components,
    providers: [],
})
export class DynamicLinkedListsModule {}