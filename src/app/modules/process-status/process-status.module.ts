import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessStatusComponent } from './process-status.component';

const components = [
    ProcessStatusComponent,
]
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: components,
  exports: components,
})
export class ProcessStatusModule { }
