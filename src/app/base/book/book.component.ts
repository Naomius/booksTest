import {Component, Inject, OnInit} from '@angular/core';
import {BookFacadeService} from "../../core/services/facadesManagement/book.facade.service";
import {BookFacadeToken} from "./tokens/BookFacadeToken";
import {BooksAndBookHelperService} from "../../core/services/booksAndBookHelper.service";
import {Observable, Subject} from "rxjs";
import {BookId} from "../books/books.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss'],
    providers: [
        BookFacadeService,
        {provide: BookFacadeToken, useExisting: BookFacadeService}
    ]
})
export class BookComponent implements OnInit{
    book$: Observable<Book | null>;
    public bookCounterChange$: Subject<BookId> = new Subject<BookId>;
    constructor(@Inject(BookFacadeToken) private bookFacadeService: IBookManager,
                private bookHelper: BooksAndBookHelperService,
                private router: Router) {
        this.book$ = this.bookHelper.selectedBookAction$;
    }

    ngOnInit(): void {
        this.book$.subscribe(book => {
          if (!book) {
              this.router.navigate(['/books'])
          }
        })
    }

}

export interface IBookManager {
    //methods from Facade
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
