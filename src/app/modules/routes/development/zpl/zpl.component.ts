import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { StationConfigurationService } from 'src/app/modules/station-configuration/services/configuration.service';
import { SerialService } from 'src/app/services/serial.service';

const ZPL_CODES: {[key: string]: string} = {
    ean: "^XA\n^FO50,50\n^BY4\n^BEN,100,Y,N\n^FD280000198549^FS\n^XZ",
    serial: "^XA\n^FO75,285\n^BY2\n^BCN,100,Y,N,N\n^FDSE213451006A1^FS\n^XZ",
}
@Component({
  selector: 'app-zpl',
  templateUrl: './zpl.component.html',
  styleUrls: ['./zpl.component.scss']
})
export class ZplComponent implements OnInit {

    zplControl: FormControl = new FormControl(ZPL_CODES["ean"]);

    labelControl: FormControl = new FormControl();

    constructor(
        private serialService: SerialService,
        private stationConfigurationService: StationConfigurationService,
    ) {
        this.zplControl.setValidators([Validators.required]);
    }

    ngOnInit(): void {
        this.labelControl.valueChanges.subscribe(
            newValue => {
                let zpl: string = this.zplControl.value;

                this.zplControl.setValue(zpl.replace(
                    this._getReplaceString(zpl), `^FD${newValue}^FS`
                ));
            }
        );
    }

    print(): void {
        this.stationConfigurationService.getPrinters().pipe(
            switchMap(printers => this.serialService.printZPL(this.zplControl.value, printers[0]))
        ).subscribe(console.log);
    }

    setZplFor($event: any): void {
        this.zplControl.setValue(ZPL_CODES[$event.value]);
    }

    private _getReplaceString(zpl: string): string {
        let startIndex: number = 0;
        let endIndex: number = 0;

        for (let i = 0 ; i < zpl.length ; i++) {
            if (zpl.charAt(i) == "^" && zpl.charAt(i+1) == "F") {
                if (zpl.charAt(i+2) == "D") {
                    startIndex = i;
                }

                if (zpl.charAt(i+2) == "S") {
                    endIndex = i+2;
                }
            }
        }

        return zpl.substring(startIndex, endIndex + 1);
    }
}
