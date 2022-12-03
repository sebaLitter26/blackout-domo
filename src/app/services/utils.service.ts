import { Injectable } from '@angular/core';

export type ObjectType = "object" | "array" | "primitive";

@Injectable({
    providedIn: 'root',
})
export class UtilsService {

    constructor() { }

    /**
     * Devuelve el tipo del objeto.
     * @param _object el objeto
     */
    getObjectType(_object: any): ObjectType | null {
        if (_object == null || _object == undefined) {
            return null;
        }
        if (typeof _object == "object") {
            return _object.length >= 0 ? "array" : "object";
        }

        return "primitive";
    }

    /**
     * Formatea un string usado como un nombre propio.
     * @param name el nombre a formatear
     */
    stringifyName(name: string): string {
        const _names: string[] = name.split(" ");
        let formatedName: string = "";

        for (let _name of _names) {
            let _lcName: string = _name.toLowerCase();
            let _ucLetter: string = _lcName.charAt(0).toUpperCase();
            let _formatedName: string = _ucLetter + _lcName.substring(1, _lcName.length);

            formatedName += _formatedName + " ";
        }

        formatedName.trimEnd();

        return formatedName;
    }
    /**
     *
     * @param url url a verificar
     * @returns boolean que confirma o no si es una imagen
     */
    isImgLink(url: string): boolean {
        if (typeof url !== 'string') return false;
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
    }
     /**
      * Dada una cadena de caracteres, la separa en líneas de acuerdo al valor dado.
      * @param maxCharactersPerLine Máximo de caracteres por línea.
      * @param data Cadena de caracteres a separar en líneas.
      * @returns Cadena de caracteres separada en líneas.
      */
    breakLine(maxCharactersPerLine: number, textToConvert: string): string[] {
        if (textToConvert.length >= maxCharactersPerLine) {
            /** Convierte el texto de string a array para un mejor manejo de la operación. */
            let arrayConvertedText: string[] = textToConvert.split(" ");
            /** Contiene las distintas palabras referentes al string pasado como párametro .*/
            let wordsArray: string[] = [];
            /** Contine la transformación final a devolver. */
            let newText = "";
            /** Se encarga de controlar que la cantidad de palabras por línea no supere los 18 caracteres. */
            let accum = 0;
            /** Incluye las palabras removidas por iteración */
            let removedWords: string[] = [];
            /** Palabra removida al pasarse del máximo de caracteres establecido  */
            let removedWord: string | undefined = "";
            /** Incluye la línea a armar en cada iteración de acuerdo al maximo de caracteres establecido. */
            let lineBuilder = "";

            for (let word of arrayConvertedText) {
                wordsArray.push(word);

                accum += word.length;

                if (accum >= maxCharactersPerLine) {
                    // Si hay palabras removidas, debemos agregarlas en la siguiente iteración para que sea tomada
                    // en cuenta por el acumulador.
                    if (removedWords) {
                     wordsArray.unshift(...removedWords);
                     removedWord = "";
                     removedWords = [];
                    }
                    lineBuilder = wordsArray.join(" ");

                    while (lineBuilder.length > maxCharactersPerLine) {

                        removedWord = wordsArray.pop();
                        removedWords.push(<string>removedWord);
                        lineBuilder = wordsArray.join(" ");
                    }

                    lineBuilder = lineBuilder + "\n";

                    accum = 0;

                    if(removedWord) {
                        accum += removedWords.reverse().join(" ").length;
                    }

                    wordsArray = [];
                }

                newText = newText.concat(<string>lineBuilder);
                lineBuilder = "";
            }

            /** Remueve el 'string escape' para tener un elemento fidedigno a las palabras originalmente pertentenientes al string dado. */
            let realText: string[] = [""];

            try {
                realText = newText?.replaceAll("\n", " ").split(" ");
            } catch (ex) {
                realText = newText?.split("\n");
            }

            /** Palabras que no superan el umbral de los caracteres máximos y por lo tanto que deben ser agregados de otra manera. */
            const forgottenWords = arrayConvertedText.filter(item => !realText?.includes(item)).join(" ");

            newText = newText.concat(forgottenWords);

            // Se obtienen las distintas líneas en las que se debe mostrar el texto.
            return newText.split("\n");
        }

        // Si el texto no supera el umbral, se debe devolver tal como vino.
        return [textToConvert];
    }

}
