import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {BookFacadeService} from "../../core/services/facadesManagement/book.facade.service";
import {BookFacadeToken} from "./tokens/BookFacadeToken";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {BookId} from "../books/books.component";
import {ActivatedRoute, Router} from "@angular/router";

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
    destroy$ = new Subject();
    constructor(@Inject(BookFacadeToken) private bookFacadeService: IBookManager,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
            this.book$ = this.bookFacadeService.Book.pipe(
                tap(book => {
                    if (!book) {
                        this.router.navigate(['/books'])
                    }
                })
            )

        this.getIdFromParams()
    }

    getIdFromParams(): void {
        this.activatedRoute.params.pipe(
            takeUntil(this.destroy$),
        ).subscribe(params => {
            const bookId = +params['id'];
            this.bookFacadeService.getBookId(bookId);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}

export interface IBookManager {
    Book: Observable<Book>;
    getBookId(id: number): void;
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
