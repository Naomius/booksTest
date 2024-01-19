import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BooksRoutingModule} from './books-routing.module';
import {BooksComponent} from "./books.component";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

@NgModule({
    declarations: [
        BooksComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        SharedModule,
        BooksRoutingModule,
        MatInputModule,
    ]
})
export class BooksModule {
}
