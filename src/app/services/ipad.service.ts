import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CacheService } from '../services/cache.service';
import { map, tap } from 'rxjs/operators';

export interface ListaEmpleados {
    Empleado: any;
    Error: any;
    listaEmpleados: Empleado[];
}

export interface Empleado {
    Foto: string;
    NombreApellido: string;
    Funcion: string;
    AntiguedadEmpresa: string;
    AntiguedadPuesto: string;
    CentroDescripcion: string;
    Division: string;
    FechaPuesto: string;
    Legajo: string;
    Posicion: string;
    Sector: string;
}

@Injectable()
export class IPadService {

    environment = environment;

    constructor(
        private http: HttpClient,
        private cacheService: CacheService
    ) { }
    /**
     * Obtiene la información de un empleado.
     * @param employeeFile el legajo de la persona
     * @returns la data del empleado
     */
    getEmployee(employeeFile: number): Observable<ListaEmpleados> {
        const cachedEmployeeData = this.cacheService.getEmployeeData(employeeFile);

        if (cachedEmployeeData) {
            return of(cachedEmployeeData);
        }

        const headers: HttpHeaders = new HttpHeaders()
            .append('Content-Type', 'application/json; charset=utf-8')


        return this.http.get<ListaEmpleados>(`${environment.apiIpad}getListaEmpleadosPorLegajo/${employeeFile}`, {
            headers: headers,
        }).pipe(
            tap((listaEmpleados: ListaEmpleados) => {
                this.cacheService.setEmployee(employeeFile, listaEmpleados);
            })
        );
    }
}
