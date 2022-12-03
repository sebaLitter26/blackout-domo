import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';


interface TestData {
    nombre: string;
    descripcion: string;
    telefono: string;
}

@Component({
    selector: 'app-component-debugging',
    templateUrl: './component-debugging.component.html',
    styleUrls: ['./component-debugging.component.scss']
})
export class ComponentDebuggingComponent {


    data: TestData[] = [
        {
            nombre: "Braian Rosales",
            descripcion: "Desarrollador Front-End Angular",
            telefono: "111222333",
        },
        {
            nombre: "Alixson Bastidas",
            descripcion: "Desarrollador Front-End Angular",
            telefono: "123123123",
        },
        {
            nombre: "Daniel Fimiani",
            descripcion: "Desarrollador Back-End .NET",
            telefono: "45454545",
        },

    ];

    properties: (keyof TestData)[] = [
        "descripcion", "nombre"
    ];

    constructor (
      private changeDetectorRef: ChangeDetectorRef,
  ) {}


    procesaFinalizacion(e : Object) {
        console.log(e);
        
    }
    procesaClick(e : Object) {
      console.log(e);
  }

  detectChanges(): void {
      this.changeDetectorRef.detectChanges();
  }


}


