import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountService } from '@app/_services';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { HomeComponent } from '../home'
import { RegisterComponent } from './register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MaintenancePageComponent } from '@app/maintenance-page/maintenance-page.component';


const routes: Routes = [
    // only use when the project in under maintenance
    // start

    // { path: '', component: MaintenancePageComponent },

    // EndHere
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'resetPassword/:id/:token', component: ResetPasswordComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }