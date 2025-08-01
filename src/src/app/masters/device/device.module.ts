import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';


import { DeviceRoutingModule } from './device-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DeviceRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        QRCodeModule,

    ],
    declarations: [
        LayoutComponent,
        ListComponent
    ]
})
export class DeviceModule { }