import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ErrorModule } from '../../fragment/error/error.module';

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
