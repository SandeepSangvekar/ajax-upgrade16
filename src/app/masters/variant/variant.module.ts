import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';


import { VariantRoutingModule } from './variant-routing.module';
import { LayoutComponent } from './layout.component';
import { VariantComponent } from './variant.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        VariantRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    declarations: [
        LayoutComponent,
        VariantComponent
    ]
})
export class VariantModule { }