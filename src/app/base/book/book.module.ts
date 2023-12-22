import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import {BookComponent} from "./book.component";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [
        BookComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        BookRoutingModule
    ]
})
export class BookModule { }
