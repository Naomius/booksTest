import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Book, BooksCounter} from "../books/interfaces/IBook";

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {
    private booksInCartSubject$ = new BehaviorSubject<Book[]>([]);

    public booksInCart$: Observable<Book[]> = this.booksInCartSubject$.asObservable();

  constructor() { }

   addToCart(book: Book, count: number = 1): void {
      const currentBooks = this.booksInCartSubject$.value;
      const existingBook = currentBooks.find(book => book.id === book.id);

      if (existingBook) {
          existingBook.count += count;
      } else {
          const newBook = {...book, count: count};
          currentBooks.push(newBook)
      }
   }

   removeFromCart(bookId: number): void {
      let currentBooks = this.booksInCartSubject$.value;
      const bookIndex = currentBooks.findIndex(book => book.id === bookId);

      if (bookIndex !== -1) {
          currentBooks.splice(bookIndex, 1);
          this.booksInCartSubject$.next([...currentBooks]);
      }
   }

}
