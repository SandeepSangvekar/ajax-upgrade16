import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { LocationRoutingModule } from './location-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';




@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LocationRoutingModule,
        Ng2SearchPipeModule,
        NgxPaginationModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
    ]
})
export class LocationModule { }