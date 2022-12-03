import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[itemDetailHost]'
})
export class ItemDetailHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
