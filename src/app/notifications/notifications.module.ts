import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';


import { NotificationsRoutingModule } from './notifications-routing.module';
import { LayoutComponent } from './layout.component';
import { NotificationsComponent } from './notifications.component';
import { dateFilter } from './dateFilter/dateFilter.pipe';
import { DatePipe } from '@angular/common';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NotificationsRoutingModule,
        FormsModule,
        Ng2SearchPipeModule, 
        NgxPaginationModule,

    ],
    declarations: [
        LayoutComponent,
        NotificationsComponent,
        dateFilter
    ],
    providers: [DatePipe]
})
export class NotificationsModule { }