import { NgModule, Type } from "@angular/core";
import { SharedModule } from "../shared.module";
import { PluImageComponent } from "./plu-image/plu-image.component";
import { StringSplitterComponent } from "./string-splitter/string-splitter.component";
import { StringShowMore } from './string-show-more/string-show-more.component';

const components: Type<any>[] = [
    PluImageComponent,
    StringSplitterComponent,
    StringShowMore
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: components,
    exports: components,
})
export class RoutesCommonModule {}
