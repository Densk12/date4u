import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./view/features/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./view/features/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./view/features/search/search.module').then(m => m.SearchModule)
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }