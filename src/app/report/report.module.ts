import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import {​​​​​​​​ UserlogsComponent }​​​​​​​​ from'./userlogs/userlogs.component';
import { ReportRoutingModule } from './report-routing.module';
import { LayoutComponent } from './layout.component';
import { ReportComponent } from './report.component';
import { ExcelService, ExcelServiceXlsx } from '../_services/excel.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ReportRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
    declarations: [
        LayoutComponent,
        ReportComponent,
        UserlogsComponent
    ],
    providers: [ExcelService,ExcelServiceXlsx]
})
export class ReportModule { }