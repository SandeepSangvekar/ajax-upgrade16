import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { NotificationsComponent } from './notifications.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: NotificationsComponent },
  
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationsRoutingModule { }