import { Component, Input, OnInit, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicTableColumnMenuData, DynamicTableColumnMenuOption } from 'src/app/modules/common/dynamic-table-column-menu';
import { DynamicTableColumnMenuComponent } from 'src/app/modules/common/dynamic-table-column-menu/dynamic-table-column-menu/dynamic-table-column-menu.component';
import { DynamicComponent, DynamicTableDefinition, ItemDetailComponent } from 'src/app/modules/ui/dynamic-table';
import { Role } from '..';
import { CheckBoolComponent } from '../permissions/components/check-bool/check-bool.component';
import { AssociatedProfilesComponent } from '../roles/components/associated-profiles/associated-profiles.component';
import { RolesService } from '../services/roles.service';
import { DialogEditRolesComponent } from '../roles/components/dialog-edit-roles/dialog-edit-roles.component';
import { map, Subject, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RolePayload } from '../index';

@Component({
    selector: 'app-roles-list',
    templateUrl: './roles-list.component.html',
    styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

     /** Flag que indica si se debe habilitar la opción de ordenamiento de la `DynamicTableComponent` en el listado de perfiles. */
    @Input()
    useSorting: boolean = false;

     /** Flag que indica si se debe habilitar la opción de filtrado de la `DynamicTableComponent` en el listado de perfiles. */
    @Input()
    useFilters: boolean = false;

     /** Flag que indica si se debe habilitar la opción de selección múltiple de la `DynamicTableComponent` en el listado de perfiles. */
    @Input()
    useSelection: boolean = false;

    /** Flag que indica si se debe habilitar la opción de "seleccionar todos" para la funcionalidad de selección múltiple de la `DynamicTableComponent` en el listado de perfiles. */
    @Input()
    allowSelectAll: boolean = true;

    /** Flag que indica si se debe habilitar la opción de filas expansibles de la `DynamicTableComponent` en el listado de perfiles. */
    @Input()
    expandableRows: boolean = true;

    /** Flag que indica si deben ocultarse los permisos que estén deshabilitados. Por default es `false`. */
    @Input()
    hideDisabled: boolean = false;

     /** Variable donde se guardan todos los roles traidos desde RolesService */
    roles: Role[] = [];

    /** Flag que indica si se está cargando la lista de roles. */
    loading: boolean = false;

       /** La definición de la tabla que muestra el listado de roles. */
    tableDefinition: DynamicTableDefinition = {
    displayedColumns: ["id_rol", "rol", "descripcion", "fecha_creacion", "activo", "acciones"],
    headerCellDefinitions: ["Numero", "Rol", "Descripción", "Creado", "Habilitado", "Acciones"],
}
    /**Propiedad que se utiliza para renderizar la tabla */
    tableUpdateSource: Subject<boolean> = new Subject<boolean>();
    
     /** Componentes custom a usar en el listado de Role. */
    customComponents: (Type<any> | DynamicComponent | null)[] = [
        null, null, null, null, null, CheckBoolComponent, {
            type: DynamicTableColumnMenuComponent,
            componentData: <DynamicTableColumnMenuData> {
                options: <DynamicTableColumnMenuOption<Role>[]>[
                    {
                        icon: "edit",
                        description: "Editar",
                        optionFn: (role: Role) => {
                            this.dialog.open(DialogEditRolesComponent, {
                                width:'500px',
                                data: {
                                    id_rol: role.id_rol,
                                    activo: role.activo,
                                    fecha_creacion: role.fecha_creacion,
                                    descripcion: role.descripcion,
                                    rol: role.rol
                                },
                            });
                        },
                    },
                    {
                        icon: (role: Role) => {
                            return role.activo ? "block" : "check_circle";
                        },
                        description: (role: Role) => {
                            return role.activo ? "Deshabilitar" : "Habilitar";
                        },
                        optionFn: (role: Role) => {
                            this.changeOfEnabled(role)
                        },
                    },
                ],
            }
        }
    ];
    
    /** Componente de detalle a mostrar la celda del Rol. */
    itemDetailComponent: Type<ItemDetailComponent> = AssociatedProfilesComponent;

     /** Flag que indica si se produjo un error al consultar el listado de roles */
    error: boolean = false;


    constructor( 
    private rolesService: RolesService, 
    public dialog: MatDialog 
    ) {}
        
    ngOnInit(): void {
        this.loadRoles();
        // this.rolesService.refresh$.pipe(
        //     switchMap((event) => this.rolesService.roles()),
        // ).subscribe((roles: Role[]) =>{
        //     this.roles = roles;
        //     setTimeout(() => {
        //         this.tableUpdateSource.next(true);
        //     }, 100);
        // });
        this.rolesService.refresh$.subscribe(() => {
            this.loadRoles();
        });
    }

    /**Swich cambio el enabled entre 1 y 0. */
    changeOfEnabled(role: Role): void {
        let roleEdited: RolePayload  = {
            id_rol: role.id_rol,
            rol: role.rol,
            descripcion: role.descripcion,
            enabled: Math.abs(role.activo - 1),
        }
        this.rolesService.roleModification(roleEdited).subscribe()
    }

    /**Carga de los roles, en caso de retornar un error activa el flag error. */
    loadRoles(): void {
        this.error = false;
        this.loading = true;

        this.rolesService.roles().pipe(
            map((roles: Role[]) => this.hideDisabled ? roles.filter((role: Role) => role.activo == 1) : roles),
        ).subscribe({
            next: (roles: Role[]) => {
                this.roles = roles;
                this.error = false;
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.roles = [];
                this.error = true;
                this.loading = false;
            },
        });
    }    
}
