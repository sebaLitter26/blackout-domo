/**
 * Contiene utilidades varias para PLUs
 */
 export namespace PluUtils {

    /**
     * Obtiene la URL de la imagen de un producto a partir del PLU
     * @param plu el plu
     * @returns la URL de la imagen
     */
    export function buildPluImageUrl(plu: string): string {
        const trimedPlu: string = Number.parseInt(plu).toString().padStart(8, "0");
        const urlBase: string = "http://cotodigital.sp9.redcoto.com.ar/full/";
        let editedPlu: string = "";

        for (let i = 0 ; i < trimedPlu.length ; i++) {
            if (i < trimedPlu.length - 2) {
                editedPlu += trimedPlu.charAt(i);
            } else {
                editedPlu += "0";
            }
        }

        return `${urlBase}${editedPlu}/${trimedPlu}.jpg`;
    }

    export const SUCURSAL_CD: string = "133";
}
