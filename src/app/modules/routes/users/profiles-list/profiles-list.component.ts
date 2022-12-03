import { HttpErrorResponse } from '@angular/common/http';
import { Component,  EventEmitter,  Input, OnInit, Output, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Subject, switchMap } from 'rxjs';
import { DynamicTableColumnMenuData, DynamicTableColumnMenuOption } from 'src/app/modules/common/dynamic-table-column-menu';
import { DynamicTableColumnMenuComponent } from 'src/app/modules/common/dynamic-table-column-menu/dynamic-table-column-menu/dynamic-table-column-menu.component';
import { DynamicComponent, DynamicTableDefinition, ItemDetailComponent } from 'src/app/modules/ui/dynamic-table';
import { Profile } from '..';
import { CheckBoolComponent } from '../permissions/components/check-bool/check-bool.component';
import { AssociatedPermissionsComponent } from '../profiles/components/associated-permissions/associated-permissions.component';
import { DialogEditProfilesComponent } from '../profiles/components/dialog-edit-profiles/dialog-edit-profiles.component';
import { ProfilesService } from '../services/profiles.service';
import { ProfilePayload } from '../index';
import { DynamicSearchResult } from 'src/app/modules/ui/dynamic-search';

@Component({
    selector: 'app-profiles-list',
    templateUrl: './profiles-list.component.html',
    styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent implements OnInit {

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

    /** Margen de la barra de búsqueda. */
    @Input()
    searchBarMargin: string = "";

    /**
     * Evento disparado cuando se selecciona una fila en caso de que `useSelection` esté habilitado.
     * 
     * Encapsula al `selectionEvent` de la `DynamicTableComponent`.
     */
    @Output()
    selectionEvent: EventEmitter<Profile[]> = new EventEmitter<Profile[]>();


    /** La definición de la tabla que muestra el listado de perfiles. */
    @Input()
    tableDefinition: DynamicTableDefinition = {
        displayedColumns: ["id_perfil", "perfil", "descripcion", "fecha_creacion", "activo","acciones"],
        headerCellDefinitions: ["Numero", "Perfil", "Descripción", "Creado" ,"Habilitado","Acciones"],
    }

    /** Variable donde se guardan todos los perfiles traidos desde `ProfilesService` */
    profiles: Profile[] = [];

    /**Propiedad que se utiliza para renderizar la tabla */
    tableUpdateSource: Subject<boolean> = new Subject<boolean>();

    /** Componentes custom a usar en el listado de permisos. */
    customComponents: (Type<any> | DynamicComponent | null)[] = [
        null, null, null, null, null, CheckBoolComponent, {
            type: DynamicTableColumnMenuComponent,
            componentData: <DynamicTableColumnMenuData> {
                options: <DynamicTableColumnMenuOption<Profile>[]>[
                    {
                        icon: "edit",
                        description: "Editar",
                        optionFn: (profile: Profile) => {
                            this.dialog.open(DialogEditProfilesComponent, {
                                width: '500px',
                                data: {
                                    perfil: profile.perfil,
                                    descripcion: profile.descripcion,
                                    id_perfil: profile.id_perfil,
                                    activo: profile.activo,
                                    fecha_creacion: profile.fecha_creacion,
                                },
                            });
                        },
                    },
                    {
                        icon: (profile: Profile) => {
                            return profile.activo ? "block" : "check_circle";
                        },
                        description: (profile: Profile) => {
                            return profile.activo ? "Deshabilitar" : "Habilitar";
                        },
                        optionFn: (profile: Profile) => {
                            this.changeOfEnabled(profile)
                        },
                    },
                ],
            }
        }
    ];

    /** Componente de detalle a mostrar la celda del perfil. */
    itemDetailComponent: Type<ItemDetailComponent> = AssociatedPermissionsComponent;

    /** Flag que indica si se produjo un error al consultar el listado de perfiles */
    error: boolean = false;

    /** Flag que indica si se está cargando la lista de perfiles. */
    loading: boolean = false;

    /** Propiedades en las cuales realizar la búsqueda ingresada por el usuario. */
    filterProperties: (keyof Profile)[] = ["descripcion", "perfil"];

    /** 
     * Listado de perfiles filtrados actualmente.
     * 
     * Por default son todos los perfiles.
     */
    filteredProfiles: Profile[] = [];

    constructor(
        private profilesService: ProfilesService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.loadProfiles();

        this.profilesService.refresh$.subscribe(() => {
            this.loadProfiles();
        });
    }

    /**
     * Switch cambio el enabled entre 1 y 0.
     */
    changeOfEnabled(profile: Profile): void {
        const profileEdited: ProfilePayload  = {
            id_perfil: profile.id_perfil,
            perfil: profile.perfil,
            descripcion: profile.descripcion,
            enabled: Math.abs(profile.activo - 1),
        }

        this.profilesService.profileModification(profileEdited).subscribe()
    }

    /**
     * Carga el listado de perfiles completo.
     */
    loadProfiles(): void {
        this.error = false;
        this.loading = true;

        this.profilesService.getProfiles().pipe(
            map((profiles: Profile[]) => this.hideDisabled ? profiles.filter((profiles: Profile) => profiles.activo == 1) : profiles),
        ).subscribe({
            next: (profiles: Profile[]) => {
                this.profiles = profiles;
                this.filteredProfiles = profiles;
                this.error = false;
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.profiles = [];
                this.filteredProfiles = [];
                this.error = true;
                this.loading = false;
            },
        });
    }

    /**
     * Handler para evento de resultado de búsqueda de perfiles.
     * 
     * Se encarga de actualizar la lista de perfiles con el resultado de la búsqueda.
     * 
     * @param $event el evento de búsqueda
     */
    onSearchResult($event: DynamicSearchResult<Profile>): void {
        this.filteredProfiles = $event.searchResult;

        setTimeout(() => {
            this.tableUpdateSource.next(true);
        }, 100); 

    }
}
