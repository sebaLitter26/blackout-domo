import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, Subject } from 'rxjs';
import { DynamicTableDefinition } from 'src/app/modules/ui/dynamic-table';
import { Role, RolesProperties, Profile, Permission } from '../../../index';
import { DialogCreateComponent } from '../../../permissions/components/dialog-create/dialog-create.component';


@Component({
    selector: 'app-dialog-create-role',
    templateUrl: './dialog-create-role.component.html',
    styleUrls: ['./dialog-create-role.component.scss'],
})
export class DialogCreateRoleComponent implements OnInit {
    /**variable donde se guarda los Perfiles para asignarle al nuevo perfil creado. */
    newProfileList: Profile[] = [];

    /** Se crea instancia de formulario con nombre myForm con sus respectivos campos, agregando validaciónes. */
    myForm: FormGroup = this.fb.group({
        rol: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
    });

    /** Definición de la tabla de perfiles dentro de roles. */
    profilesTableDefinition: DynamicTableDefinition = {
        displayedColumns: ['id_perfil', 'perfil', 'descripcion'],
        headerCellDefinitions: ['ID', 'Perfil', 'Descripción'],
    };

    /** Definicion de la tabla de permisos dentro de roles generada con los check */
    permissionTableDefinition: DynamicTableDefinition = {
        displayedColumns: ['id_permiso', 'permiso', 'descripcion'],
        headerCellDefinitions: ['ID', 'Permiso', 'Descripción']
    }

    /** Flag que ejecuta el alert desde el template */
    alert: boolean = false;

    /** Texto que se le pasa al componente permissionList */
    templateText: string = 'Se listan los permisos de los perfiles agregados'

    /** Icono dinamico */
    icon: string = 'notification_important'

    /** Loadin dinamico */
    loading: boolean = false;

    /** Lista de permisos que se renderizan en la 2da tabla */
    @Input() permissionList:  Subject<Permission[]> = new Subject()
    
    constructor(
        public dialogRef: MatDialogRef<DialogCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Role,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.myForm.reset();
    }

    /**
     *  Metodo que se ejecuta con el evento click del boton Guardar.
     *  Deja el objeto de tipo Role guardado en payload para luego ser manipulado.
     */
    saveRoles(): void {
        this.alert = this.newProfileList.length === 0;
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            return;
        }
        if (!this.alert) {
            const rolesProperties: RolesProperties = {
                rol: this.myForm.get('rol')?.value,
                descripcion: this.myForm.get('descripcion')?.value,
                newProfileList: this.newProfileList,
            };
            this.dialogRef.close(rolesProperties);
        }
    }

    /**
     * Actualiza el listado de perfiles seleccionados,
     * al mismo tiempo agrega los permisos de los perfiles a una nueva lista.
     */
    updateSelectedProfiles($event: Profile[]): void {
        let list: Permission[] = [];
        $event.map((profile) => {
            list = list.concat(profile.permisos);
        });
        this.newProfileList = $event;
        this.permissionList.next(list)
    }
}


