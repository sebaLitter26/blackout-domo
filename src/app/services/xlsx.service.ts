import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

/**
 * Servicio con utilidades para archivos de Excel.
 */
@Injectable()
export class XLSXService {

    constructor() {}

    /**
     * Parsea un objeto y lo exporta a un archivo `.xlsx`
     * @param _xlsx referencia al módulo de `xlsx`. Se utiliza code-splitting para reducir el tamaño del bundle final en los módulos que importen a `XLSXService`, ya que `xlsx` no es tree-shakeable
     * @param data el objeto
     * @param fileName el nombre del archivo
     */
    exportJSON(_xlsx: any, data: any, fileName: string): void {
        const worksheet = _xlsx.utils.json_to_sheet(data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

        _xlsx.writeFile(workbook, fileName);
    }

    /**
     * Parsea un objeto y lo exporta a un archivo `.xlsx`, de forma asíncrona.
     * @param data el objeto
     * @param fileName el nombre del archivo 
     * @returns un `Observable` que emite una vez que el archivo haya sido exportado
     */
    exportJSONAsync(data: any, fileName: string, headers: string[] = []): Observable<boolean> {
        return from(import("xlsx")).pipe(
            tap(_xlsx => {
                const worksheet =_xlsx.utils.json_to_sheet(data);
                if (headers.length>0) {  
                        //Inserta informacion adicional al final del Excel, como importes totales o cantidades.
                        _xlsx.utils.sheet_add_aoa(worksheet, [headers], {origin: -1})
                } 
                
                const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

                _xlsx.writeFile(workbook, fileName);
            }),
            map(_xlsx => (true)),
        );
    }
}
