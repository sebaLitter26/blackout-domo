import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SerialService } from "src/app/services/serial.service";
import { ZPLService } from "src/app/services/zpl.service";
import { SharedModule } from "../shared.module";
import { CoolDirectivesModule } from "../ui/cool-input/cool-directives/cool-directives.module";
import { StationConfigDialogComponent } from "./station-config-dialog/station-config-dialog.component";

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        CoolDirectivesModule,
    ],
    declarations: [
        StationConfigDialogComponent,
    ],
    providers: [
        ZPLService,
        SerialService,
    ]
})
export class StationConfigurationModule {}