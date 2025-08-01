import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


import { TrackRoutingModule } from './track-routing.module';
import { LayoutComponent } from './layout.component';
import { TrackComponent } from './track.component';
import { dateFilter } from './dateFilter/dateFilter.pipe';
import { DatePipe } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { TrackSummaryComponent } from './track-summary/track-summary.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TrackRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        AgmCoreModule
    ],
    declarations: [
        LayoutComponent,
        TrackComponent,
        dateFilter,
        TrackSummaryComponent
    ],
    
    providers: [DatePipe]
})
export class TrackModule { }