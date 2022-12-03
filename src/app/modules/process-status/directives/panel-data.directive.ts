import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directiva utilizada en `ProcessStatusComponent` para indicar a un host `PanelDataComponent`
 */
@Directive({
    selector: '[panelDataHost]',
})
export class PanelDataDirective {
    constructor (
        public viewContainerRef: ViewContainerRef
    ) {}
}
