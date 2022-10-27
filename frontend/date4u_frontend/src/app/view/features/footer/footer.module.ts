import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';

// ng g m view/features/footer

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule { }
