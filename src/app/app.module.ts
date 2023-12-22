import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {BooksModule} from "./base/books/books.module";
import { HeaderComponent } from './base/header/header.component';
import {HeaderModule} from "./base/header/header.module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BooksModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HeaderModule
    ],
    providers: [],
    bootstrap: [AppComponent],

})
export class AppModule {

}
