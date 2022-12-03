import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Permission } from '../../..';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
    selector: 'app-dialog-edit',
    templateUrl: './dialog-edit-permissions.component.html',
    styleUrls: ['./dialog-edit-permissions.component.scss'],
})
export class DialogEditPermissionsComponent implements OnInit {
    /** Se creo propiedad para guardar información desde el ngOnInit y reflejar esa información en los inputs del formulario.*/
    enabled: string | null = null;

    /** Contiene los campos del formulario en el pop up de editar.*/
    myForm: FormGroup = this.fb.group({
        id_permiso: [this.data.id_permiso],
        permiso: [this.data.permiso, [Validators.required]],
        descripcion: [this.data.descripcion, [Validators.required]],
        enabled: [this.data.activo],
    });

    constructor(
        public dialogRef: MatDialogRef<DialogEditPermissionsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Permission,
        private fb: FormBuilder,
        private permissionService: PermissionsService
    ) {}

    ngOnInit(): void {
        if (this.data.activo == 1) {
            this.enabled = 'Si';
        } else {
            this.enabled = 'No';
        }
    }

    /** Si el formulario es invalido y fue tocado retorna true, generando una alerta en la UI desde el template.*/
    notValid() {
        return this.myForm.invalid && this.myForm.touched;
    }

    /** Metodo que se ejecuta con el evento click del botón Guardar.*/
    savePermission() {
        console.log('Datos del permiso actual: ', this.myForm.value);
        this.permissionService
            .permissionModification(this.myForm.value)
            .subscribe();
    }
}
