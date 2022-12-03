export namespace ArrayUtils {

    /**
     * Toma un array y agrupa sus elementos con el valor correspondiente a la key enviada por parámetro.
     * @param arr el array
     * @param key la key
     * @returns un objeto cuyas propiedades son los valores de agrupamiento, y los valores son los elementos del array correspondientes a ese grupo
     */
    export function groupBy<T>(arr: T[] = [], key: keyof T): {[key: string]: T[]} {
        if (!arr) {
            return {};
        }

        const initialValue: {[key: string]: T[]} = {};
        
        return arr.reduce((acc, cval) => {
            const myAttribute: any = cval[key];
            acc[myAttribute] = [...(acc[myAttribute] || []), cval];
            return acc;
        }, initialValue) ?? {};
    }

    /**
     * Toma un array y ordena sus elementos, elimina elementos duplicados segun el valor correspondiente a la key enviada por parámetro y borra elementos segun el valor correspondiente al value enviado por parámetro
     * @param arr el array
     * @param key la key
     * @param second_key la second_key
     * @param value el value
     * @returns un array cuyos elementos no se encuentran repetidos
     */
    export function removeDuplicate<T, K extends keyof T, Z extends T[K]>(arr: T[] = [], key: K, second_key: K, value: Z ) : T[]{
        if (!arr) {
            return [];
        }

        const compare = (a:T, b:T)=> {
            if (a[key] > b[key]) return 1;
            if (a[key] < b[key]) return -1;
            if (a[second_key] > b[second_key]) return 1;
            if (a[second_key] < b[second_key]) return -1;
            return 0;
        }
        
        let tempArray: T[] = [];
        arr = arr.filter(seleccionado => {
            if(seleccionado[key] != value) 
                return true;
            else {
                tempArray.push(seleccionado);
                return false;
            }
            
        });
        tempArray = tempArray.sort(compare);
        const length = tempArray.length;
        let duplicates: T[] = [];
        for (let i = 0; i < length; i++) {
            if (JSON.stringify(tempArray[i + 1]) == JSON.stringify(tempArray[i])) {
                duplicates.push(tempArray[i]);
            }
        }
        arr.push(...duplicates);
        return arr;
    }
    
    /**
     * Toma un array y elimina sus elementos duplicados segun con el valor correspondiente a la key enviada por parámetro.
     * @param arr el array
     * @param key la key
     * @returns un array sin elementos duplicados en el la propiedad key enviada por parametro.
     */
    export function unique<T, K extends keyof T>(arr: T[], key: K) : T[] {
        const uniqueIds: T[K][] = [];
        return arr.filter(element => {
        const isDuplicate = uniqueIds.includes(element[key]);
      
        if (!isDuplicate) {
          uniqueIds.push(element[key]);
      
          return true;
        }
      
        return false;
      });
    }

    /*
     * Toma un listado de arrays y los fusiona, eliminando los elementos duplicados.
     * @param arrs el listado de arrays
     * @returns un array con todos los elementos del conjunto de arrays, sin duplicados
     */
    export function mergeWithoutDuplicates<T>(arrs: T[][]): T[] {
        const bigArray: T[] = arrs.reduce((acum: T[], item: T[]) => {
            return acum = [...acum, ...item];
        }, []);

        return [...new Set(bigArray)];
    }
}