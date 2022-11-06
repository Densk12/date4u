import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModule } from './error/error.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogModule } from './dialog/dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ErrorModule,
    FooterModule,
    HeaderModule,
    DialogModule
  ],
  exports: [
    ErrorComponent,
    FooterComponent,
    HeaderComponent,
    DialogComponent
  ],
  declarations: [
  ]
})
export class FragmentModule { }
