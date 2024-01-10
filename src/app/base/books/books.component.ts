import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
    BehaviorSubject, catchError,
    combineLatest, EMPTY,
    filter,
    map,
    Observable,
    startWith,
    Subject,
    takeUntil, tap,
} from "rxjs";

import {Sort} from "@angular/material/sort";
import {BooksId, BooksFacadeService} from "../../core/services/facadesManagement/books.facade.service";
import {BooksFacadeToken} from "./tokens/booksFacadeToken";
import {BooksFacadeHelper} from "../../shared/helpers/booksFacadeHelper";
import {CartBook} from "../../core/services/cartStore.service";
import {Router} from "@angular/router";
import {BooksAndBookHelperService} from "../../core/services/booksAndBookHelper.service";

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss'],
    providers: [
        BooksFacadeService,
        {provide: BooksFacadeToken, useExisting: BooksFacadeService}
    ]
})
export class BooksComponent implements OnInit, OnDestroy {
    @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;

    displayedColumns: string[] = ['position', 'image', 'name', 'price', 'description', 'buy'];

    public books$!: Observable<Book[]>;
    public currentBooksInCart: Observable<CartBook[]>; //для актуальных данных с корзины
    public filteredAndSortedBooks$: Observable<Book[]>;

    public bookCounterChange$: Subject<BookId> = new Subject<BookId>;
    public filterBooks$: Subject<string> = new Subject<string>();
    public sortBooks$: Subject<Sort> = new Subject<Sort>();
    public error$: Subject<string> = new Subject<string>();
    public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private destroy$: Subject<boolean> = new Subject();


    constructor(@Inject(BooksFacadeToken) private mainFacadeService: IBooksManager,
                private router: Router,
                private booksHelper: BooksAndBookHelperService) {
    }


    ngOnInit(): void {

        this.books$ = this.mainFacadeService.Books.pipe(
            tap(_ => this.isLoading$.next(true)),
            startWith([]),
            catchError(err => {
                this.error$.next(err);
                return EMPTY
            }),
            tap(_ => this.isLoading$.next(false))
        )

        // this.currentBooksInCart = this.mainFacadeService.bookInCart$;

        this.filteredAndSortedBooks$ = combineLatest([
            this.books$,
            this.filterBooks$.pipe(startWith('')),
            this.sortBooks$.pipe(startWith(null))
        ]).pipe(
            map(([books, searchStr, sortEvent]) => BooksFacadeHelper.sortBooksByEvent(books, searchStr, sortEvent)),
        );

        this.initializeSideEffects();
    }

    public cleanSearchInput(): void {
        this.filterBooks$.next('');
        this.filterInput.nativeElement.value = '';
    }

    private initializeSideEffects(): void {
        this.bookCounterChange$.pipe(
            filter(bookToCart => bookToCart.count >= 0),
            takeUntil(this.destroy$)
        ).subscribe(bookToCart => {
            if (bookToCart.count > 0) {
                console.log(`Заказали книгу по id ${bookToCart.id} в кол-ве ${bookToCart.count} шт.`);
                this.mainFacadeService.updateCart({ id: bookToCart.id, count: bookToCart.count });
            } else {
                console.log(`Убрали из заказа книгу по id ${bookToCart.id}`);
                this.mainFacadeService.updateCart({id: bookToCart.id, count: 0});
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }
}

export interface IBooksManager {
    Books: Observable<Book[]>,
    updateCart(booksCounter: BooksId): void,
}

export interface Book {
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: number,
    image: string,
    url: string,
}

export interface BookId {
    id: number,
    count: number,
}


