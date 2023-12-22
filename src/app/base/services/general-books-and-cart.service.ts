import { Injectable } from '@angular/core';
import {BooksCounter} from "../books/books.component";

@Injectable({
  providedIn: 'root'
})
export class GeneralBooksAndCartService {
    private booksCounter = new Map<number, number>();
  constructor() { }

    updateBooksCounter(newCounter: BooksCounter): void {
        if (newCounter.count === 0) {
            this.booksCounter.delete(newCounter.id);
        } else {
            this.booksCounter.set(newCounter.id, newCounter.count);
        }
    }

}
