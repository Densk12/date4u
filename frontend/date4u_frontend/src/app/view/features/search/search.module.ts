import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ng g m view/features/search

const routes: Routes = [
  { path: "", component: SearchComponent }
];


@NgModule({
  declarations: [
    SearchComponent
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
export class SearchModule { }
