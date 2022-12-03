import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, delay, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role, RolePayload, CRUDRolePayload, RoleId, CRUDRoleProfileRPayload } from '../index.d';

@Injectable({
    providedIn: 'root',
})
export class RolesService {

    private _refresh$ = new Subject<void>();

    get refresh$() {
        return this._refresh$;
        }

    constructor(private http: HttpClient) {}

    roles(): Observable<Role[]> {
        return this.http.get<Role[]>(`${environment.apiUrlTicket}Permisos/GetRoles`);
    }

    roleModification(payload: RolePayload): Observable<Role>{
        return this.http.put<Role>(`${environment.apiUrlTicket}Permisos/ModificacionRol`, payload)
        .pipe(
            tap(()=>{
                this.refresh$.next()
            })
        )
    }

    /** Crea un nuevo rol.
     *  Retorna un ID para luego hacer la relacion con los perfiles
     */
    createRole(payload: CRUDRolePayload): Observable<any>{
        console.log('PayloadRol enviado: ', payload);
        return this.http.post<CRUDRolePayload>(`${environment.apiUrlTicket}Permisos/CreacionRol`,payload)
    }

    /** Relaciona un rol con sus perfiles seleccionados.*/
    profileRoleRelationship(payload: CRUDRoleProfileRPayload[]): Observable<CRUDRoleProfileRPayload[]>{
        console.log('PayloadRelaciones enviado:', payload);
        return this.http.post<CRUDRoleProfileRPayload[]>(`${environment.apiUrlTicket}Permisos/RelacionRolPerfil`,payload)
    }
}
