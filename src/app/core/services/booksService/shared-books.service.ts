import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchMap, tap} from "rxjs";
import {Book} from "../facadesManagement/books.facade.service";
import {ApiBooksService} from "../apiService/apiBooks.service";

@Injectable({
  providedIn: 'root'
})
export class SharedBooksService {

    private booksCache$: BehaviorSubject<Book[] | null> = new BehaviorSubject<Book[] | null>(null);
  constructor(private apiBooksService: ApiBooksService) { }

    private getBooksFromApiService(): Observable<Book[]> {
        return this.apiBooksService.getBooks().pipe(
            map(json => json.books.map(book => ({
                ...book,
                price: Number(book.price.replace(/[^0-9\.-]+/g, ""))
            }))),
            tap(books => this.booksCache$.next(books))
        );
    }

    getBooks(): Observable<Book[]> {
      return this.booksCache$.pipe(
          switchMap(books => books === null ? this.getBooksFromApiService() : of(books))
      )
    }

}

