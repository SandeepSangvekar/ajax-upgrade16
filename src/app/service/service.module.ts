import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { ServiceRoutingModule } from './service-routing.module';
import { LayoutComponent } from './layout.component';
import { ServiceComponent } from './schedule/service.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ServiceRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    declarations: [
        ServiceComponent,
        UpdateComponent,
        LayoutComponent
    ]
})
export class ServiceModule { }