import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogCreateComponent } from '../../../permissions/components/dialog-create/dialog-create.component';
import { Profile, Permission, CRUDProfilePayload, ProfileProperties } from '../../../index.d';
import { DynamicTableDefinition } from 'src/app/modules/ui/dynamic-table';

@Component({
    selector: 'app-dialog-create-profile',
    templateUrl: './dialog-create-profile.component.html',
    styleUrls: ['./dialog-create-profile.component.scss'],
})
export class DialogCreateProfileComponent implements OnInit {
    /**variable donde se guarda los permisos para asignarle al nuevo perfil creado. */
    newPermissionsList: Permission[] = [];

    /** Se crea instancia de formulario con nombre myForm con sus respectivos campos, agregando validaciónes. */
    myForm: FormGroup = this.fb.group({
        profile: ['', [Validators.required]],
        description: ['', [Validators.required]],
    });

    /** Definición de la tabla de permisos. */
    permissionsTableDefinition: DynamicTableDefinition = {
        displayedColumns: ['id_permiso', 'permiso', 'descripcion'],
        headerCellDefinitions: ['ID', 'Permiso', 'Descripción'],
    };

    /** Flag que ejecuta el alert desde el template */
    alert: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DialogCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Profile,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.myForm.reset();
    }

    /**
     *  Metodo que se ejecuta con el evento click del boton Guardar.
     *  Deja el objeto de tipo Profile guardado en payload para luego ser manipulado.
     */
    saveProfile(): void {
        this.alert = this.newPermissionsList.length === 0;
        
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            return;
        }

        if (!this.alert) {
            const profileProperties: ProfileProperties = {
                perfil: this.myForm.get('profile')?.value,
                descripcion: this.myForm.get('description')?.value,
                newPermissionsList : this.newPermissionsList,
            };
            this.dialogRef.close(profileProperties);
        }
    }

    /**
     * Actualiza el listado de permisos seleccionados.
     */
    updateSelectedPermissions($event: Permission[]): void {
        this.newPermissionsList = $event;
    }
}
