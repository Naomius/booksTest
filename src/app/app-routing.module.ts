import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BooksComponent} from "./base/books/books.component";

const routes: Routes = [
    {
        path: '',
        component: BooksComponent
    },
    {
        path: '',
        loadChildren: () => import('./base/shoppingCart/shopping-cart.module').then(m => m.ShoppingCartModule),
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
