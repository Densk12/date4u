import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ng g m view/features/profile

const routes: Routes = [
  { path: "", component: ProfileComponent }
];

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileModule { }
