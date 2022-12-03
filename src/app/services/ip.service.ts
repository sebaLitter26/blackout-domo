import { HttpClient  } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class IpService {
    
    constructor(
        private http: HttpClient
    ) {}

    /**
     * Obtiene la IP del usuario
     * @returns un `Observable` con la IP formato `string`
     */
    getIP(): Observable<string>{
        return this.http.get<string>(`${environment.apiUrl}GetIpCliente`);
    }
}