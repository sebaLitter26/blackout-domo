import { Component } from '@angular/core';
import { ProfilesService } from '../services/profiles.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateProfileComponent } from './components/dialog-create-profile/dialog-create-profile.component';
import { EMPTY, of, switchMap } from 'rxjs';
import { CRUDProfilePayload, Permission, ProfileId} from '..';
import { CRUDPermissionProfileRPayload, ProfileProperties } from '../index';
import { TipoOperacion } from '../model';

@Component({
    selector: 'app-profiles',
    templateUrl: './profiles.component.html',
    styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent {

    constructor(
        private profilesService: ProfilesService,
        public dialog: MatDialog
    ) {}

    /** 
     * Metodo que se ejecuta al darle click al boton |Crear perfil| desde la UI.
     * Este metodo genera un pop-up que abre un dialog que contiene un formulario dentro del componente DialogCreateComponent.
     */
    openDialog(): void {
        let listPermissions: Permission[] = [];

        this.dialog.open(DialogCreateProfileComponent,{ width:'900px'}).afterClosed().pipe(
            switchMap((profileProperties: ProfileProperties | null) => {
                if (!profileProperties) {
                    return EMPTY;
                }

                const profilePayload: CRUDProfilePayload = {
                    perfil: profileProperties.perfil,
                    descripcion: profileProperties.descripcion
                }

                listPermissions = profileProperties.newPermissionsList;
                return this.profilesService.createProfile(profilePayload)
            }),
            switchMap((profile: ProfileId) => {
                const listRelations: CRUDPermissionProfileRPayload[] = listPermissions.map((permission: Permission) => {
                    return {
                        id_perfil: profile.id_perfil,
                        id_permiso: permission.id_permiso,
                        tipoOperacion: TipoOperacion.ALTA
                    }
                });

                return this.profilesService.permissionProfileRelationship(listRelations)
            })
        ).subscribe();
    }
}
