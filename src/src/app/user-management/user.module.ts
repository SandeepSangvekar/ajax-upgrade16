import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';

import { UserRoutingModule } from '../user-management/user.routing.module';
import { UsersComponent } from '../user-management/users/users.component';
import { DealerComponent } from '../user-management/dealer/dealer.component';
import { ResetPasswordPageComponent } from '../user-management/reset-password/reset-password.component';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule

    ],
    declarations: [
        UsersComponent,
        DealerComponent,
        ResetPasswordPageComponent
      
    ]
})
export class UserModule { }