import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
    BehaviorSubject, catchError,
    combineLatest, EMPTY,
    filter,
    map,
    Observable,
    startWith,
    Subject,
    takeUntil, tap, withLatestFrom,
} from "rxjs";

import {Sort} from "@angular/material/sort";
import {BooksId, BooksFacadeService} from "../../core/services/facadesManagement/books.facade.service";
import {BooksFacadeToken} from "./tokens/booksFacadeToken";
import {BooksFacadeHelper} from "../../shared/helpers/booksFacadeHelper";

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

    private books$!: Observable<Book[]>;
    private booksInCart$!: Observable<BookId[]>;
    private booksAndItsCountInCart$!: Observable<BookAndCount[]>;
    public filteredAndSortedBooks$: Observable<BookAndCount[]>;

    public bookCounterChange$: Subject<BookId> = new Subject<BookId>;
    public filterBooks$: Subject<string> = new Subject<string>();
    public sortBooks$: Subject<Sort> = new Subject<Sort>();
    public error$: Subject<string> = new Subject<string>();
    public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private destroy$: Subject<boolean> = new Subject();

    constructor(@Inject(BooksFacadeToken) private mainFacadeService: IBooksManager) {}

    ngOnInit(): void {
        this.booksInCart$ = this.mainFacadeService.BookInCart;

        this.books$ = this.mainFacadeService.Books.pipe(
            tap(_ => this.isLoading$.next(true)),
            startWith([]),
            catchError(err => {
                this.error$.next(err);
                return EMPTY
            }),
            tap(_ => this.isLoading$.next(false)),
        );

        this.booksAndItsCountInCart$ = this.books$.pipe(
            withLatestFrom(this.booksInCart$),
            map(([books, booksInCart]) => {
                return books.map(book => {
                    const bookCountInCart: number = booksInCart
                        .find(bookCount => bookCount.id === book.id)?.count || 0;
                    return {
                        book: book,
                        count: bookCountInCart
                    }
                })
            })
        );

        this.filteredAndSortedBooks$ = combineLatest([
            this.booksAndItsCountInCart$,
            this.filterBooks$.pipe(startWith('')),
            this.sortBooks$.pipe(startWith(null))
        ]).pipe(
            map(([booksAndCount, searchStr, sortEvent]) => {
                    let filteredBooks: BookAndCount[] = searchStr.trim() ?
                        booksAndCount.filter(({book}) =>
                            book.title.toLowerCase().includes(searchStr.toLowerCase()) ||
                            book.subtitle.toLowerCase().includes(searchStr.toLowerCase())
                        ) :
                        [...booksAndCount];

                    return BooksFacadeHelper.sortBooks(filteredBooks, sortEvent);
                }
            ));

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
            const count = bookToCart.count > 0 ? bookToCart.count : 0;
            this.mainFacadeService.updateCart({id: bookToCart.id, count})
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }
}

export interface IBooksManager {
    Books: Observable<Book[]>;
    BookInCart: Observable<BookId[]>;
    updateCart(booksCounter: BooksId): void;
}

export interface Book {
    id: number;
    title: string;
    subtitle: string;
    isbn13: string;
    price: number;
    image: string;
    url: string;
}
export interface BookAndCount {
    book: Book;
    count: number;
}

export interface BookId {
    id: number;
    count: number;
}


