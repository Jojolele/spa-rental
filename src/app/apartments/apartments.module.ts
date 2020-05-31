import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ApartmentCreateComponent } from './apartment-create/apartment-create.component';
import { ApartmentListComponent } from './apartment-list/apartment-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ApartmentCreateComponent, ApartmentListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
  ],
})
export class ApartmentsModule {}
