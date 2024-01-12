import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {BookFacadeService} from "../../core/services/facadesManagement/book.facade.service";
import {BookFacadeToken} from "./tokens/BookFacadeToken";
import {filter, Observable, Subject, take, takeUntil, tap} from "rxjs";
import {BookId} from "../books/books.component";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BooksId} from "../../core/services/facadesManagement/books.facade.service";

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
    book$: Observable<Book>;
    public bookCounterChange$: Subject<BookId> = new Subject<BookId>();
    destroy$: Subject<boolean> = new Subject();
    constructor(@Inject(BookFacadeToken) private bookFacadeService: IBookManager,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.book$ = this.bookFacadeService.Book;

        this.initializeSideEffects();
        this.initializeSideEffectsBooksCounter();
    }

    initializeSideEffects(): void {
        this.activatedRoute.params.pipe(
            takeUntil(this.destroy$),
        ).subscribe((params: Params): void => {
            const bookId: number = Number(params['id']);
            this.bookFacadeService.getBookId(bookId);
        });
    }

    initializeSideEffectsBooksCounter(): void {
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
    getBookId(id: number): void;
    updateCart(booksId: BooksId): void;
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
