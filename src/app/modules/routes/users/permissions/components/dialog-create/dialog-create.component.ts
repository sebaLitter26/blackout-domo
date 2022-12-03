import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Permission } from '../../..';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
    selector: 'app-dialog-create',
    templateUrl: './dialog-create.component.html',
    styleUrls: ['./dialog-create.component.scss'],
})
export class DialogCreateComponent {
    /** Se crea propiedad de tipo Permission(interface) para guardar los value del formulario. */
    permissionCreated: Permission | null = null;

    /**Variable donde se guardan todos los permisos */
    permissions: Permission[] = []

    /** Se crea instancia de formulario con nombre myForm con sus respectivos campos, agregando validaciónes. */
    myForm: FormGroup = this.fb.group({
        permiso: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
    });

    constructor(
        public dialogRef: MatDialogRef<DialogCreateComponent>,
        private fb: FormBuilder,
        private permissionsService: PermissionsService
    ) {}

    /** Si el formulario es invalido y fue tocado retorna true, generando una alerta en la UI desde el template.*/
    notValid() {
        return this.myForm.invalid && this.myForm.touched;
    }

    savePermission() {
            this.permissionCreated = this.myForm.value;
            this.permissionsService.creationPermission(this.permissionCreated!).subscribe()
            this.dialogRef.close();
        }
}


