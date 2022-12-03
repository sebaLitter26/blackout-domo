import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../../../index';
import { RolesService } from '../../../services/roles.service';

@Component({
    selector: 'app-dialog-edit-roles',
    templateUrl: './dialog-edit-roles.component.html',
    styleUrls: ['./dialog-edit-roles.component.scss'],
})
export class DialogEditRolesComponent implements OnInit {
    /** Se crearon propiedades para guardar información desde el ngOnInit y reflejar esa información en los inputs del formulario.*/
    enabled: string | null = null;

    /** Se crea instancia de formulario con nombre myForm con sus respectivos campos, agregando validaciónes. */
    myForm: FormGroup = this.fb.group({
        id_rol: [this.data.id_rol,[]],
        rol: [this.data.rol, [Validators.required]],
        descripcion: [this.data.descripcion, [Validators.required]],
        enabled: [this.data.activo,[]],
    });

    constructor(
        public dialogRef: MatDialogRef<DialogEditRolesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Role,
        private fb: FormBuilder,
        private rolesService: RolesService 
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

    /** Metodo que se ejecuta con el evento click del botón Guardar. */
    saveRol() {
        this.rolesService
        .roleModification(this.myForm.value)
        .subscribe();
    }
}
