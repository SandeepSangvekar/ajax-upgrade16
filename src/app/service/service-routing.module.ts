import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ServiceComponent } from './schedule/service.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'schedule', component: ServiceComponent },
            { path: 'update', component: UpdateComponent },
  
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceRoutingModule { }