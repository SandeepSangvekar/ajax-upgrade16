import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { VariantComponent } from './variant.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: VariantComponent },
  
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VariantRoutingModule { }