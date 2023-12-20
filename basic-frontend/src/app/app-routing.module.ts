import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";


const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: '404', component: PageNotFoundComponent},
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: 'signin', loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'basket', loadChildren: () => import('./pages/basket/basket.module').then(m => m.BasketModule) },
  { path: 'article/:id', loadChildren: () => import('./pages/article/article.module').then(m => m.ArticleModule) },
  //TODO Seller geöns anlegen
  { path: 'seller/:id', loadChildren: () => import('./pages/article/article.module').then(m => m.ArticleModule) },
  { path: 'newarticle', loadChildren: () => import('./pages/newarticle/newarticle.module').then(m => m.NewarticleModule) },
  { path: 'searchResults/:searchText', loadChildren: () => import('./pages/search-results/search-results.module').then(m => m.SearchResultsModule) },
  { path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {bindToComponentInputs: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
