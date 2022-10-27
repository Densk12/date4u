import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorModule } from '../error/error.module';

// ng g m view/features/login

const routes: Routes = [
  { path: "", component: LoginComponent }
];

@NgModule({
  declarations: [
    LoginComponent
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
export class LoginModule { }
