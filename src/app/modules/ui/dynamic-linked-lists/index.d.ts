import { Type } from "@angular/core";

/**
 * Interfaz a implementar por cada componente que se muestre como un elemento de una de las listas de `DynamicLinkedListsComponent`.
 * 
 * El generic `T` se refiere al tipo de dato que utiliza cada elemento de la lista.
 * 
 * El generic `K` se refiere al tipo de dato del `customData` a utilizar por el componente. Por defecto es `any`.
 */
export interface DynamicLinkedListsComponentDisplay<T, K = any> {
    currentListIndex: number;
    originalListIndex: number;
    data: T | null;
    customData?: K;
}

/**
 * Interfaz que define el tipo de componente a mostrar para cada elemento de la lista, y opcionalmente, 
 * 
 * El generic `T` se refiere al tipo de dato que utiliza cada elemento de la lista.
 * 
 * El generic `K` se refiere al tipo de dato del `componentData` a utilizar por el componente. Por defecto es `any`.
 */
export interface DynamicLinkedListsComponentDefinition<T, K = any> {
    type: Type<DynamicLinkedListsComponentDisplay<T>>;
    componentData?: K;
}
