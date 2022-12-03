import { NgModule } from "@angular/core";
import { SharedModule } from "../shared.module";
import { GdmService } from "./services/gdm.service";

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [],
    providers: [
        GdmService,
    ]
})
export class GdmModule {}