import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';


import { DetailsRoutingModule } from './details-routing.module';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DetailsRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,

    ],
    declarations: [
        LayoutComponent,
        DetailsComponent
    ]
})
export class DetailsModule { }