import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApartmentListComponent } from './apartments/apartment-list/apartment-list.component';
import { ApartmentCreateComponent } from './apartments/apartment-create/apartment-create.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: ApartmentListComponent },
  {
    path: 'create',
    component: ApartmentCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:apartmentId',
    component: ApartmentCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
