import { Component, OnInit, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolesService } from '../services/roles.service';
import { DialogCreateRoleComponent } from './components/dialog-create-role/dialog-create-role.component';
import { switchMap } from 'rxjs/operators';
import { RolesProperties, CRUDRolePayload, Profile, RoleId, CRUDRoleProfileRPayload } from '../index';
import { TipoOperacion } from '../model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {

    constructor( private rolesService: RolesService, public dialog: MatDialog ) {}
    
    /** Metodo que se ejecuta al darle click al boton |Crear perfil| desde la UI.
      * Este metodo genera un pop-up que abre un dialog que contiene un formulario dentro del componente DialogCreateComponent.
      */
    openDialog(){
        let listProfiles: Profile[] = []
        this.dialog.open(DialogCreateRoleComponent,{ width:'900px', maxHeight:'650px'}).afterClosed().pipe(
          switchMap((rolesProperties: RolesProperties) => {
            const rolePayload: CRUDRolePayload = {
              rol: rolesProperties.rol,
              descripcion: rolesProperties.descripcion
            }
            listProfiles = rolesProperties.newProfileList
            return this.rolesService.createRole(rolePayload)
          }),
          switchMap((role: RoleId) => {
            let listRelations: CRUDRoleProfileRPayload[] = [] 
              listProfiles.map((profile) => {
                const relationshipObj: CRUDRoleProfileRPayload = {
                  id_rol: role.id_rol,
                  id_perfil: profile.id_perfil,
                  tipoOperacion: TipoOperacion.ALTA
                }
                listRelations.push(relationshipObj)
              })
              return this.rolesService.profileRoleRelationship(listRelations)
          })).subscribe()
    }
}
