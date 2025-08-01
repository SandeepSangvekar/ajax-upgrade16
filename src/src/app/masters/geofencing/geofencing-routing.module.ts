import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeofencingComponent } from './geofencing.component';

const routes: Routes = [
  {
      path: '', component: GeofencingComponent,
      children: [
          { path: '', component: GeofencingComponent },

      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeofencingRoutingModule { }




