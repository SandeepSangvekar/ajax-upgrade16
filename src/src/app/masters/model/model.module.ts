import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';


import { ModelRoutingModule } from './model-routing.module';
import { LayoutComponent } from './layout.component';
import { ModelComponent } from './model.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ModelRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,

    ],
    declarations: [
        LayoutComponent,
        ModelComponent
    ]
})
export class ModelModule { }