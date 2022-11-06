import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsAuthenticatedGuard } from './business_logic/service/is-authenticated-guard/is-authenticated.guard';
import { IsNotAuthenticatedGuard } from './business_logic/service/is-not-authenticated-guard/is-not-authenticated.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./view/page/login/login.module').then(m => m.LoginModule),
    canActivate: [IsNotAuthenticatedGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./view/page/register/register.module').then(m => m.RegisterModule),
    canActivate: [IsNotAuthenticatedGuard]
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./view/page/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./view/page/search/search.module').then(m => m.SearchModule),
    canActivate: [IsAuthenticatedGuard]
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
