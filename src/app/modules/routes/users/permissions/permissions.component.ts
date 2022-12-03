import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateComponent } from './components/dialog-create/dialog-create.component';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
})

export class PermissionsComponent {

    constructor(
        public dialog: MatDialog
    ) {}

    /** Metodo que se ejecuta al darle click al boton |Crear permiso| desde la UI.
     * Este metodo genera un pop-up que abre un dialog que contiene un formulario dentro del componente DialogCreateComponent.
     */
    openDialog(): void {
        this.dialog.open(DialogCreateComponent,{ width:'400px'})
    }
}

