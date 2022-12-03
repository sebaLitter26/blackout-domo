import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared.module";
import { CoolInputComponent } from "./cool-input/cool-input.component";
import { NgxMaskModule, IConfig } from 'ngx-mask'

const components = [
    CoolInputComponent,
]

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: components,
    exports: components,
})
export class CoolInputModule {}