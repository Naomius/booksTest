import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBook} from "./interfaces/IBook";
import {Subject} from "rxjs";
import {Sort} from "@angular/material/sort";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

    public books: IBook[] = [];
    public booksCopy: IBook[] = []
    public searchString = '';
    public error = '';
    public isLoading = false;
    private destroy$ = new Subject();
    displayedColumns: string[] = ['position', 'image', 'name', 'price', 'description', 'buy'];

    constructor() {
    }

    ngOnInit(): void {
    }

    //Сортировка

    sortBooks(sort: Sort): void {
        console.log(sort)
        const data = this.books.slice();
        if (!sort.active || sort.direction === '') {
            this.books = this.booksCopy;
            return;
        }
        this.books = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'title':
                    return this.compare(a.title, b.title, isAsc);
                case 'price':
                    return this.compare(a.price, b.price, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

}
