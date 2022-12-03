import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

export const MAX_INFO_LINE_LENGTH = 60;

@Injectable()
export class ZPLService {

    constructor(private utilsService: UtilsService) { }

    /**
     * Genera el código ZPL para una etiqueta de serie de fabricante (etiqueta void)
     * @param serial el número de serie
     * @returns el código ZPL para una etiqueta de serie de fabricante
     */
    generateVoidLabel(serial: string): string {
        let zpl: string =

            "^XA" +
            
            "^FO35,20" +
            "^BY1" +
            "^BCN,75,N,N,N" +
            `^FD${serial}^FS` +

            "^FO45,100" +
            "^A024,24" +
            `^FD${serial}^FS` +

            "^XZ"

        return zpl;
    }

    /**
     * Genera el código ZPL para una etiqueta de pallet.
     * @param serial el número de pallet
     * @returns el código ZPL para una etiqueta de pallet
     */
    generatePalletLabel(serial: string): string {
        let zpl: string =

            "^XA" +

            "^FO600,80" +
            "^A0R72,72" +
            "^FDPALLET" +
            "^FS" +
            
            "^FO175,530" +
            "^BY2" + 
            "^BCR,175,N,N,N" +
            `^FD${serial}` +
            "^FS" +
            
            "^FO90,495" +
            "^A0R64,64" +
            `^FD${serial}` +
            "^FS" +
            
            "^XZ"
        
        return zpl;
    }

     /**
     * Genera el código ZPL de una etiqueta de serie Coto, para un tamaño de etiqueta de 17cm x 8,5cm.
     * @param serial el número de serie
     * @param plu el plu del producto
     * @param description la descripción del producto
     * @returns el código ZPL
     */
      generateDefectiveSerial(serial: string, plu: string, description: string, ean: string): string {
        /** Líneas correspondientes a la descripción del producto. */
        const descriptionLines: string[] = description ? this.utilsService.breakLine(18, description) : [];
        /** Contiene la descripción final del producto. */
        let desc: string = "";
        /** Contiene las coordenadas en el eje Y en la etiqueta para la descripción del producto. */
        let yDescLine = 375;

        const pluLine: string = plu ?
            "^FO600,710" +
            "^A0R52,52" +
            `^FDPLU: ${plu}^FS`
        : "";

        const eanLine: string = ean ?
            "^FO525,710" +
            "^A0R52,52" +
            `^FDEAN: ${ean}^FS`
        : "";

        const descriptionLine: string = description ?
            "^FO450,710" +
            "^A0R52,52" +
            "^FDDESCRIPCION:^FS" +
            desc 
        : "";

        for (let descLine of descriptionLines) {
            desc = desc.concat(
                `^FO${yDescLine},710` +
                "^A0R52,52" +
                `^FD${descLine}^FS`);

                yDescLine -= 55;
        }

        let zpl: string =

            "^XA" +
            "^FO30,20" +
            "^GB655,660,2" +
            "^FS" +

            "^FO465,20" +
            "^GB220,660,2" +
            "^FS" +

            "^FO600,175" +
            "^A0R64,64" +
            "^FDCoto CICSA^FS" +

            "^FO175,200" +
            "^BY2" +
            "^BCR,155,N,N,N" +
            `^FD${serial}^FS`+

            `^FO100,215` +
            `^A0R52,52` +
            `^FD${serial}^FS` +

            "^FO30,680" +
            "^GB655,660,2" +
            "^FS" +

            pluLine +
            eanLine +
            descriptionLine +

            "^XZ"

        return zpl;
    }

    /**
     * Genera el código ZPL de una etiqueta de serie Coto, para un tamaño de etiqueta de 17cm x 8,5cm.
     * @param serial el número de serie
     * @param reservation el número de reserva
     * @param plu el plu del producto
     * @param description la descripción del producto
     * @returns el código ZPL
     */
    generateSerialLabel(serial: string, plu: string, description: string, ean: string, dummy?: string): string {
        /** Líneas correspondientes a la descripción del producto. */
        const descriptionLines: string[] = this.utilsService.breakLine(18, description);
        /** Contiene la descripción final del producto. */
        let desc: string = "";
        /** Contiene las coordenadas en el eje Y en la etiqueta para la descripción del producto. */
        let yDescLine = 375;

        for (let descLine of descriptionLines) {
            desc = desc.concat(
                `^FO${yDescLine},710` +
                "^A0R52,52" +
                `^FD${descLine}^FS`);

                yDescLine -= 55;
        }

        let zpl: string =

            "^XA" +
            "^FO30,20" +
            "^GB655,660,2" +
            "^FS" +

            "^FO465,20" +
            "^GB220,660,2" +
            "^FS" +

            "^FO600,175" +
            "^A0R64,64" +
            "^FDCoto CICSA^FS" +

            "^FO545,145" +
            "^A0R46,46" +
            "^FDENVIO A DOMICILIO^FS" +

            "^FO500,80" +
            "^A0R24,24" +
            "^FDVENTA POR RESERVA^FS" +

            "^FO175,200" +
            "^BY2" +
            "^BCR,155,N,N,N" +
            `^FD${serial}^FS`+

            `^FO100,215` +
            `^A0R52,52` +
            `^FD${serial}^FS` +

            "^FO30,680" +
            "^GB655,660,2" +
            "^FS" +

            "^FO600,710" +
            "^A0R52,52" +
            `^FDPLU: ${plu}^FS` +

            "^FO525,710" +
            "^A0R52,52" +
            `^FDEAN: ${ean}^FS` +

            "^FO450,710" +
            "^A0R52,52" +
            "^FDDESCRIPCION:^FS" +

            desc +
            "^XZ"

        return zpl;
    }

    /**
     * Genera formato del QR para su impresión con token.
     *
     * @param token token que identifica al usuario
     * @returns retorna QR a imprimir
     */
    generateUserQR(token: string, username: string, sucursal: number = 60) {
        let zpl: string = "";
        zpl =
            "^XA" +
            "^FO150,120" +
            "^A0,26,26" +
            `^FDLEG: ${username} - SUC: ${sucursal}^FS` +
            `^FO150,95^BQN,2,4,M,7^FDQA,${token}^FS` +
            `^BY5,2,70` +
            "^XZ";
        return zpl;
    }

    /**
     * Genera el código ZPL para una etiqueta de prueba.
     *
     * @returns el código ZPL de un etiqueta de prueba
     */
    generateMockZPL(): string {
        let zpl: string = "";
        zpl =
            "^XA" +
            "^FO150,120" +
            "^A0,26,26" +
            `^FDETIQUETA DE PRUEBA^FS` +
            `^BY5,2,70` +
            "^XZ";
        return zpl;
    }

    /**
     * Genera el código ZPL para una etiqueta de pallet.
     * @param serial el número de pallet
     * @returns el código ZPL para una etiqueta de pallet
     */
     generatePlatformLabel(paltform: string): string {
        let zpl: string =

            "^XA" +

            "^FO600,700" +
            "^A0R72,72" +
            "^FDANDEN" +
            "^FS" +
            
            "^FO175,525" +
            "^BY5" + 
            "^BCR,200,N,N,N" +
            `^FD${paltform}` +
            "^FS" +
            
            "^FO70,650" +
            "^A0R72,72" +
            `^FD${paltform}` +
            "^FS" +
            
            "^XZ"
        
        return zpl;
    }
}
