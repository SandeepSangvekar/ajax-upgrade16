import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add.component';

import { LayoutComponent } from './layout.component';
import { MachineComponent } from './machine.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: MachineComponent },
            { path: 'add', component: AddComponent },
  
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MachineRoutingModule { }