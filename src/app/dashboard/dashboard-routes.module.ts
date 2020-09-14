import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { DashboardComponent } from './dashboard.component';
// import { AuthGuard } from './../services/auth.guard';

const rutasHijas: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: dashboardRoutes,
    // canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(rutasHijas)],
})
export class DashboardModule {}
