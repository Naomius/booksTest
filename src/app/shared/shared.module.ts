import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSortModule} from "@angular/material/sort";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {NgPipesModule} from "ngx-pipes";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import { CounterComponent } from './components/counter/counter.component';
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
  ],
    imports: [
        CommonModule,
        FormsModule,
        CounterComponent,
        RouterLink
    ],
    exports: [
        RouterLink,
        HttpClientModule,
        MatSortModule,
        MatSnackBarModule,
        MatMenuModule,
        NgPipesModule,
        MatSortModule,
        MatTableModule,
        MatButtonModule,
        CounterComponent,
    ]
})
export class SharedModule { }
