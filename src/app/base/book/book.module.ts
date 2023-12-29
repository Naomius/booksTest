import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import {BookComponent} from "./book.component";
import {HttpClientModule} from "@angular/common/http";
import {CounterComponent} from "../../shared/components/counter/counter.component";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [
        BookComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        HttpClientModule,
        BookRoutingModule,
    ]
})
export class BookModule { }
