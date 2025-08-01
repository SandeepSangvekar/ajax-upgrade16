import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


import { CustomerRoutingModule } from './customer-routing.module';
import { LayoutComponent } from './layout.component';
import { CustomerComponent } from './customer.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CustomerRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    declarations: [
        LayoutComponent,
        CustomerComponent
    ]
})
export class CustomerModule { }