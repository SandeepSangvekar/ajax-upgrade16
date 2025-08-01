import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { CustomerComponent } from './customer.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: CustomerComponent },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }