import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Permission, Profile } from '../../../index';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
    selector: 'app-associated-permissions',
    templateUrl: './associated-permissions.component.html',
    styleUrls: ['./associated-permissions.component.scss'],
})
export class AssociatedPermissionsComponent implements OnInit {
    /**En data se encuentra todas las propiedades del perfil. */
    data: Profile | null = null;

    /** Flag que indica si se produjo un error al consultar el listado de permisos. */
    error: boolean = false;

    /** Variable donde se guardan todos los permisospara asignar */
    allPermissionsToAssign: Permission[] | undefined = [];

    constructor(private permissionsService: PermissionsService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.error = true
        }, 1800);
        this.permissionsService
            .getPermissions()
            .subscribe(
                (permissions) =>
                    (this.allPermissionsToAssign =
                        this.permissionFiltering(permissions))
            );
    }

    /**Mapea todos los nombres de los permisos traidos de data sobre el perfil de la celda actual. */
    permissionsName(): string[] {
        return this.data?.permisos.map(
            (permission) => permission.permiso
        )!;
    }

    /**Filtra todos los permisos que no se encuentra en la lista de permisos asignados del perfil actual. */
    permissionFiltering(permissions: Permission[]) {
        let newArrayPermissions: Permission[] = [];
        permissions.forEach((element) => {
            if (!this.permissionsName().includes(element.permiso)) {
                newArrayPermissions.push(element);
            }
        });
        return newArrayPermissions;
    }

    /**Este evento se ejecuta al mover la celda del permiso. */
    drop(event: CdkDragDrop<Permission[] | undefined>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data!,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data!,
                event.container.data!,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    /**Este método genera un msj si el perfil actual no tiene permisos. */
    noPermissions() {
        return this.data?.permisos.length === 0;
    }

    /**Retorna true si la columna se queda sin permisos. */
    allPermissionsColumnEmpty() {
        return this.allPermissionsToAssign?.length === 0;
    }
}
