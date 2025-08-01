import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


import { ShipmentRoutingModule } from './shipment-routing.module';
import { LayoutComponent } from './layout.component';
import { ShipmentComponent } from './shipment.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ShipmentRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    declarations: [
        LayoutComponent,
        ShipmentComponent
    ]
})
export class ShipmentModule { }