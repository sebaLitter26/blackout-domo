import { Injectable } from '@angular/core';
import { delay, EMPTY, Observable, of, Subject } from 'rxjs';
import { CRUDProfilePayload, Profile, ProfilePayload } from '..';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { CRUDPermissionProfileRPayload } from '../index';

@Injectable({
    providedIn: 'root',
})
export class ProfilesService {
    
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    /** Retora todos los perfiles */
    getProfiles(): Observable<Profile[]> {
        return this.http.get<Profile[]>(`${environment.apiUrlTicket}Permisos/GetPerfiles`);
    }

    /** Edita el perfil */
    profileModification(payload: ProfilePayload): Observable<Profile>{
        return this.http.put<Profile>(`${environment.apiUrlTicket}Permisos/ModificacionPerfil`,payload)
        .pipe(
            tap(() => {
                this._refresh$.next()
            })
        )
    }

    /** Crea un nuevo perfil.
     *  Retorna un ID para luego hacer la relación con los permisos
    */
    createProfile(payload: CRUDProfilePayload): Observable<any> {
        console.log('PayloadPerfil enviado: ', payload);
        return this.http.post<CRUDProfilePayload>(`${environment.apiUrlTicket}Permisos/CreacionPerfil`, payload)
    }
    
    /** Relaciona un perfil con sus permisos seleccionados.*/
    permissionProfileRelationship(payload: CRUDPermissionProfileRPayload[]): Observable<CRUDPermissionProfileRPayload[]>{
        console.log('PayloadRelaciones enviado:', payload);
        return this.http.post<CRUDPermissionProfileRPayload[]>(`${environment.apiUrlTicket}Permisos/RelacionPerfilPermiso`,payload)
    }
}
