import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { ImportComponent } from './components/import/import.component';

@NgModule({
  declarations: [ListComponent, ImportComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [ListComponent]
})
export class ProductionModule { }
