import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestClientService } from './services/rest-client.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports:[
    CommonModule,
    HttpClientModule
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [RestClientService]
    }
  }

  static forChild(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    }
  }

 }
