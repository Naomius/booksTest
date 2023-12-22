import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Book, BooksCounter} from "./interfaces/IBook";
import {map, merge, Observable, Subject, withLatestFrom} from "rxjs";
import {Sort} from "@angular/material/sort";
import {BooksFacadeService} from "../../core/services/facadesManagement/books.facade.service";
import {BooksFacadeToken} from "./tokens/booksFacadeToken";

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss'],
    providers: [
        BooksFacadeService,
        {provide: BooksFacadeToken, useExisting: BooksFacadeService}
    ]
})
export class BooksComponent implements OnInit {
    @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;

    public error = ''; // перевести на Реактивщину
    public isLoading = false; // перевести на Реактивщину
    displayedColumns: string[] = ['position', 'image', 'name', 'price', 'description', 'buy'];

    public books$!: Observable<Book[]>;
    public sortedBooks$: Observable<Book[]>;
    public filteredBooks$: Observable<Book[]>;

    public bookCounterChange$: Subject<BooksCounter> = new Subject<BooksCounter>;
    public filterBooks$: Subject<string> = new Subject<string>();
    public sortBooks$: Subject<Sort> = new Subject<Sort>();


    constructor(@Inject(BooksFacadeToken) private mainFacadeService: IBooksManager) {
    }


    ngOnInit(): void {
        this.books$ = this.mainFacadeService.Books;
        //Фильтр
        this.filteredBooks$ = merge(
            this.books$,
            this.filterBooks$.pipe(
                withLatestFrom(this.books$),
                map(([searchStr, books]) => {
                    if (!searchStr.trim()) {
                        return books;
                    } else {
                        return books.filter(book => book.title.toLocaleLowerCase()
                                .includes(searchStr.toLowerCase())
                            || book.subtitle.toLocaleLowerCase().includes(searchStr.toLowerCase()))
                    }
                })
            )
        );

        this.sortedBooks$ = merge(
            this.filteredBooks$,
            this.sortBooks$.pipe(
                withLatestFrom(this.filteredBooks$),
                map(([sortEvent, books]) => {
                    const booksData = books.slice();
                    if (!sortEvent.active || sortEvent.direction === '') {
                        return booksData
                    } else {
                        return booksData.sort(this._compare(sortEvent.active, sortEvent.direction === 'asc'))
                    }
                })
            )
        )

        this.initializeSideEffects();
    }

    private _compare(key: string, isAsc: boolean) {
        return (a: Book, b: Book) => {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0;
            }

            const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (isAsc ? comparison : (comparison * -1));
        };
    }

    public cleanSearchInput(): void {
        this.filterBooks$.next('');
        this.filterInput.nativeElement.value = '';
    }

    private initializeSideEffects(): void {
        this.bookCounterChange$.subscribe(e => {
            this.mainFacadeService.addBooksToCart(e);
            // this.mainFacadeService.removeBooksFromCart(e);
            e.count === 0 ?
                console.log(`Убрали из заказа книгу по id ${e.id}`) :
                console.log(`Заказали книгу по id ${e.id} в кол-ве ${e.count} шт.`);
        })
    }

}


export interface IBooksManager {
    Books: Observable<Book[]>,
    addBooksToCart(newBook: BooksCounter): void,
    removeBooksFromCart(bookId: number): void,
}
