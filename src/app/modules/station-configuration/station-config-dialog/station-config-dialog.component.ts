import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ListOption, StationConfiguration } from '..';
import { SerialService } from '../../../services/serial.service';
import { ZPLService } from '../../../services/zpl.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { LabelType, StationConfigurationService } from '../services/configuration.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-station-config-dialog',
    templateUrl: './station-config-dialog.component.html',
    styleUrls: ['./station-config-dialog.component.scss']
})
export class StationConfigDialogComponent implements OnInit {

    /** `FormControl` con el nombre del host. */
    hostNameControl: FormControl = new FormControl('');
   
    /** Referencia a `environment`. */
    environment = environment;

    /**
     * Array con los puertos de conexión disponibles*.
     * 
     * * En realidad, no son puertos de conexión como tal, sino que son posiciones
     * dentro de un array de puertos disponibles con dispositivos Zebra, que es la marca
     * de impresoras que se utilizan.
     */
    positions: number[] = [0, 1, 2, 3];

    /** Opciones disponibles de tipos de etiqueta. */
    labelTypeOptions: ListOption[] = [
        {
            value: LabelType.PRODUCT,
            displayValue: "Etiqueta producto",
        },
        {
            value: LabelType.SERIAL,
            displayValue: "Etiqueta serie",
        },
        {
            value: LabelType.PALLET,
            displayValue: "Etiqueta palet",
        },
        {
            value: LabelType.PLATFORM,
            displayValue: "Etiqueta andén",
        },
    ];

    /** 
     * Opciones disponibles de puertos de conexión*.
     * 
     * *Ver propiedad `positions`.
     */
    portOptions: ListOption[] = [];

    /**
     * Array con los puertos seleccionados actualmente para cada tipo de etiqueta*.
     * 
     * *Ver propiedad `positions`.
     */
    selectedPorts: (number | null)[] = [null, null, null];

    /** `FormControl` con la ubicación de la estación. */
    ubicationControl: FormControl = new FormControl();

    /** `FormControl` con el origen de la estación. */
    origenControl: FormControl = new FormControl();

    /** `FormControl` con el destrino de la estación. */
    destinoControl: FormControl = new FormControl();

    constructor(
        public dialogRef: MatDialogRef<StationConfigDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: StationConfiguration,
        private serialService: SerialService,
        private zplService: ZPLService,
        private snackBarService: SnackBarService,
        private stationConfigurationService: StationConfigurationService,
    ) {
        this.hostNameControl.setValue(this.data.hostname);

        this.selectedPorts = this.data.printers?.map(printer => printer.position) ?? [null, null, null];

        this.ubicationControl.setValue(this.data.ubication);
        this.origenControl.setValue(this.data.subUbication?.origen);
        this.destinoControl.setValue(this.data.subUbication?.destino);
    }

    ngOnInit(): void {
        this.stationConfigurationService.getPrinters().pipe(
            tap(printers => {
                for (let printer of printers) {
                    this.portOptions.push({
                        value: printer,
                        displayValue: `Port ${printer}`,
                    })
                }
            }),
        ).subscribe();
    }

    /**
     * Obtiene la configuración actual de la estación.
     * @returns un `StationConfiguration` con la configuración de la estación
     */
    getConfig(): StationConfiguration {
        let config: StationConfiguration = {
            process: null,
            hostname: this.hostNameControl.value,
            printers: [],
            ubication: this.ubicationControl.value,
            subUbication: {origen: this.origenControl.value, destino: this.destinoControl.value },
        };

        for (let position of this.positions) {
            config.printers.push({
                position: this.selectedPorts[position],
                labelType: this.labelTypeOptions[position].value,
            });
        }

        return config;
    }

    /**
     * Imprime una etiqueta de prueba en una impresora dada.
     * @param printer la impresora
     */
    printTestLabel(printer: number | null): void {
        this.serialService.printZPL(this.zplService.generateMockZPL(), printer ?? 0).subscribe(
            result => {
                this.snackBarService.open(`Etiqueta impresa en Port ${printer}`, "Aceptar", 5000, "success-snackbar");
            },
            error => {
                this.snackBarService.open(`ERROR: Revise conexión con la impresora o pruebe otro puerto`, "Aceptar", 7500, "error-snackbar");
            }
        );
    }
}
