import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeofencingRoutingModule } from './geofencing-routing.module';
import { GeofencingComponent } from './geofencing.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [GeofencingComponent],
  imports: [
    CommonModule,
    GeofencingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ]
})
export class GeofencingModule { }
