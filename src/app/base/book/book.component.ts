import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {BookFacadeService} from "../../core/services/facadesManagement/book.facade.service";
import {BookFacadeToken} from "./tokens/BookFacadeToken";
import {filter, map, Observable, Subject, takeUntil, withLatestFrom} from "rxjs";
import {BookId} from "../books/books.component";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss'],
    providers: [
        BookFacadeService,
        {provide: BookFacadeToken, useExisting: BookFacadeService}
    ]
})
export class BookComponent implements OnInit, OnDestroy{

    public book$: Observable<Book>;
    private booksInCart$: Observable<BookId[]>;
    public booksAndCountInCart$: Observable<BookAndCount>;

    public bookCounterChange$: Subject<BookId> = new Subject<BookId>();
    private destroy$: Subject<boolean> = new Subject();
    constructor(@Inject(BookFacadeToken) private bookFacadeService: IBookManager,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.book$ = this.bookFacadeService.Book;
        this.booksInCart$ = this.bookFacadeService.BookInCart;

        this.booksAndCountInCart$ = this.book$.pipe(
            withLatestFrom(this.booksInCart$),
            map(([book, booksInCart]) => {
                const bookCountInCart: number = booksInCart
                    .find(bookCount => bookCount.id === book.id)?.count || 0;
                return {
                    book: book,
                    count: bookCountInCart
                }
            })
        );

        this.initializeSideEffects();
        this.initializeBookCounterSideEffects();
    }

    initializeSideEffects(): void {
        this.activatedRoute.params.pipe(
            takeUntil(this.destroy$),
        ).subscribe((params: Params): void => {
            const bookId: number = Number(params['id']);
            this.bookFacadeService.getBookId(bookId);
        });
    }

    initializeBookCounterSideEffects(): void {
        this.bookCounterChange$.pipe(
            filter(bookToCart => bookToCart.count >= 0),
            takeUntil(this.destroy$)
        ).subscribe(bookToCart => {
            const count = bookToCart.count > 0 ? bookToCart.count : 0;
            this.bookFacadeService.updateCart({id: bookToCart.id, count})
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

}

export interface IBookManager {
    Book: Observable<Book>;
    BookInCart: Observable<BookId[]>;
    getBookId(id: number): void;
    updateCart(bookId: BookId): void;
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

interface BookAndCount {
    book: Book;
    count: number;
}
