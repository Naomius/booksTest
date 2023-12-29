import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BooksComponent} from "./base/books/books.component";
import {BaseComponent} from "./base/base.component";

const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [
            {
                path: '',
                redirectTo: '/main',
                pathMatch: "full"
            },
            {
                path: '',
                loadChildren: () => import('./base/main/main.module').then(m => m.MainModule),
            },
            {
                path: '',
                loadChildren: () => import('./base/books/books.module').then(m => m.BooksModule),
            },
            {
                path: '',
                loadChildren: () => import('./base/shoppingCart/shopping-cart.module').then(m => m.ShoppingCartModule),
            },
            {
                path: '',
                loadChildren: () => import('./base/book/book.module').then(m => m.BookModule),
            },
            {
                path: '**',
                loadChildren: () => import('./base/page404/page-not-found.module').then(m => m.PageNotFoundModule)
            }
        ]
    },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
