import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
    BehaviorSubject, catchError,
    combineLatest, EMPTY,
    filter, finalize,
    map,
    Observable,
    startWith,
    Subject,
    takeUntil,
} from "rxjs";

import {Sort} from "@angular/material/sort";
import {BooksFacadeService} from "../../core/services/facadesManagement/books.facade.service";
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

    public bookCounterChange$: Subject<BooksCounter> = new Subject<BooksCounter>;
    public filterBooks$: Subject<string> = new Subject<string>();
    public sortBooks$: Subject<Sort> = new Subject<Sort>();
    public error$: Subject<string> = new Subject<string>();
    public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private unsubscribe$: Subject<void> = new Subject<void>();


    constructor(@Inject(BooksFacadeToken) private mainFacadeService: IBooksManager,
                private router: Router,
                private booksHelper: BooksAndBookHelperService) {
    }


    ngOnInit(): void {
        // this.isLoading$.next(true);
        this.books$ = this.mainFacadeService.getBooks().pipe(
            startWith([]),
            catchError(err => {
                this.error$.next(err);
                return EMPTY
            }),
            finalize(() => this.isLoading$.next(false)),
        );

        // this.currentBooksInCart = this.mainFacadeService.bookInCart$;

        this.filteredAndSortedBooks$ = combineLatest([
            this.books$.pipe(startWith([])),
            this.filterBooks$.pipe(startWith('')),
            this.sortBooks$.pipe(startWith(null))
        ]).pipe(
            map(([books, searchStr, sortEvent]) => BooksFacadeHelper._sortBooksByEvent(books, searchStr, sortEvent)),
        );

        this.initializeSideEffects();
    }

    public cleanSearchInput(): void {
        this.filterBooks$.next('');
        this.filterInput.nativeElement.value = '';
    }

    private initializeSideEffects(): void {
        this.bookCounterChange$.pipe(
            filter(bookToCart => bookToCart && (bookToCart.count > 0 || bookToCart.count === 0)),
            takeUntil(this.unsubscribe$)
        ).subscribe(bookToCart => {
            if (bookToCart.count > 0) {
                console.log(`Заказали книгу по id ${bookToCart.id} в кол-ве ${bookToCart.count} шт.`);
                this.mainFacadeService.addBooksToCart({ id: bookToCart.id, count: bookToCart.count });
            } else if (bookToCart.count === 0) {
                console.log(`Убрали из заказа книгу по id ${bookToCart.id}`);
                this.mainFacadeService.removeBooksFromCart(bookToCart.id)
            }
        });

    }

    selectBook(book: Book) {
        this.booksHelper.selectBook(book);
        this.router.navigate(['/book'])
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.error$.complete();
        this.isLoading$.complete();
    }

}

export interface IBooksManager {
    getBooks(): Observable<Book[]>,
    // bookInCart$: Observable<CartBookDetails[]>,
    addBooksToCart(bookToCart: BooksCounter): void,
    removeBooksFromCart(bookId: number): void,
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

export interface BooksCounter {
    id: number,
    count: number,
}

export interface BookWithCount extends Book{
    count: number
}


