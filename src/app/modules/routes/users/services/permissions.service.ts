import { Injectable } from '@angular/core';
import { delay, Observable, Subject} from 'rxjs';
import { Permission } from '..';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { PermissionPayload } from '../index';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
        }

    /** Retorna todos los permisos */
    getPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(`${environment.apiUrlTicket}Permisos/GetPermisos`);
    }

    /** Crea un nuevo permiso */
    creationPermission(permissionCreated: Permission): Observable<Permission>{
        return this.http.post<Permission>(`${environment.apiUrlTicket}Permisos/CreacionPermiso`,permissionCreated)
    }

    /** Edita un permiso */
    permissionModification(permissionEdited: Permission | PermissionPayload): Observable<Permission>{
        return this.http.put<Permission>(`${environment.apiUrlTicket}Permisos/ModificacionPermiso`,permissionEdited)
        .pipe(
            tap(() => {
                this._refresh$.next()
            })
        )
    }
}
