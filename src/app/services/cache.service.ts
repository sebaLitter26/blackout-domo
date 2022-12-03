import { Injectable } from '@angular/core';
import { ListaEmpleados } from './ipad.service';

@Injectable({
    providedIn: 'root',
})
export class CacheService {

    /** Empleados que ya fueron solicitadas en algún momento. */
    private _employees: ListaEmpleados[] = [];

    /**
     * Guarda la información de un empleado en memoria.
     * @param employeeFile el legajo del empleado
     * @param employeeData la información del empleado
     */
    setEmployee(employeeFile: number, employeeData: ListaEmpleados) {
        if (!Object.keys(this._employees).includes(employeeFile.toString())) {
            this._employees[employeeFile] = employeeData;
        }
    }

    /**
     * Obtiene la data de un empleado.
     * @param employeeFile el legajo del empleado
     */
    getEmployeeData(employeeFile: any): ListaEmpleados {
        return this._employees[employeeFile];
    }

}
