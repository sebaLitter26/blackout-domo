import { Component, OnInit, Type } from '@angular/core';
import { DynamicLinkedListsComponentDefinition, DynamicLinkedListsComponentDisplay } from '..';

@Component({
    selector: 'app-dynamic-linked-lists',
    templateUrl: './dynamic-linked-lists.component.html',
    styleUrls: ['./dynamic-linked-lists.component.scss']
})
export class DynamicLinkedListsComponent<T> implements OnInit {

    /**
     * Data a mostrar por cada lista. Se debe recibir un array por cada lista.
     */
    data: T[][] = [];

    /** 
     * Flujos de movimiento entre listas.
     * 
     * Está definido como una matriz de números con índice basado en 0. Cada número representa a una de las listas.
     * 
     * Cada flujo se lee de izquierda a derecha, e indica entre que listas se pueden mover sus elementos.
     * 
     * Por ejemplo, un caso como `[[0,1,2], [2,1]]` admite movimientos entre listas de la siguiente manera:
     * 
     * - Se pueden mover elementos desde la primera lista hacia la segunda
     * - Se pueden mover elementos desde la segunda lista hacia la tercera
     * - Se pueden mover elementos desde la tercera lista hacia la segunda
     * 
     * Los valores de cada flujo deben ser estrictamente decrecientes o crecientes. Esto quiere decir que
     * una lista como `[0,1,2,1]` no es válida y arrojará un error.
     */
    flows: number[][] = [];

    /**
     * Componente a mostrar para cada elemento de la lista.
     */
    displayComponent: Type<DynamicLinkedListsComponent<T>> | DynamicLinkedListsComponentDefinition<T> | null = null;

    constructor() {}

    ngOnInit(): void {}

}

interface TestInterface {
    a: any;
}

interface AnotherInterface {
    b: any;
}

class TestClass implements DynamicLinkedListsComponentDisplay<TestInterface, AnotherInterface> {
    data: TestInterface | null = null;
    customData?: AnotherInterface | undefined;
    currentListIndex: number = 0;
    originalListIndex: number = 1;
}
