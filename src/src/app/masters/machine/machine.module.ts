import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';


import { MachineRoutingModule } from './machine-routing.module';
import { LayoutComponent } from './layout.component';
import { MachineComponent } from './machine.component';
import { AddComponent } from './add.component';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MachineRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        QRCodeModule,


    ],
    declarations: [
        LayoutComponent,
        MachineComponent,
        AddComponent,
    ],
    providers: [DatePipe]
})
export class MachineModule { }