import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorModule } from '../../fragment/error/error.module';

const routes: Routes = [
  { path: "", component: RegisterComponent }
];

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ErrorModule
  ],
  exports: [
    RouterModule
  ]
})
export class RegisterModule { }
