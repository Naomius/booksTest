import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookComponent} from "./book.component";

const routes: Routes = [
    {
        path: 'book',
        component: BookComponent
    },
    {
        path: 'book/:id',
        component: BookComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BookRoutingModule { }
