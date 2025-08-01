import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { RolesComponent } from './roles.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule
    ],
    declarations: [    
        RolesComponent
    ],
    providers: [DatePipe]
})
export class RolesModule { }