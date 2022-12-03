import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { HttpInterceptorService } from "src/app/services/http-interceptor.service";
import { IpService } from "src/app/services/ip.service";
import { IPadService } from "src/app/services/ipad.service";
import { AuthorizationModule } from "../authorization/authorization.module";
import { NavbarModule } from "../navbar/navbar.module";
import { OverlayModule } from "../overlay/overlay.module";
import { SharedModule } from "../shared.module";
import { StationConfigurationModule } from "../station-configuration/station-configuration.module";
import { DeviceModule } from "../ui/device/device.module";
import { DialogsModule } from "../ui/dialogs/dialogs.module";
import { HeaderComponent } from "./header/header.component";
import { JwtInputComponent } from "./jwt-input/jwt-input.component";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main/main.component";
import { VersionService } from "./services/version.service";

@NgModule({
    imports: [
        MainRoutingModule,
        SharedModule,
        NavbarModule,
        DialogsModule,
        HttpClientModule,
        DeviceModule,
        OverlayModule,
        StationConfigurationModule,
        AuthorizationModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    declarations: [
        HeaderComponent,
        MainComponent,
        JwtInputComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'en-GB'
        },
        VersionService,
        IPadService,
        IpService,
    ]
})
export class MainModule {}
