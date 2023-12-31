import { Book } from "../../base/books/books.component";
import {Sort} from "@angular/material/sort";


export class BooksFacadeHelper {
     public static compare(key: string, isAsc: boolean) {
        return (a: Book, b: Book) => {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0;
            }

            const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (isAsc ? comparison : (comparison * -1));
        };
    }

    public static sortBooksByEvent(books: Book[], searchStr: string, sortEvent: Sort): Book[] {
        let filteredBooks = searchStr.trim() ?
            books.filter(book =>
                book.title.toLocaleLowerCase().includes(searchStr.toLowerCase()) ||
                book.subtitle.toLocaleLowerCase().includes(searchStr.toLowerCase())
            ) :
            [...books]

        if (sortEvent && sortEvent.active && sortEvent.direction) {
            return filteredBooks.sort(this.compare(sortEvent.active, sortEvent.direction === 'asc'));

        }

        return filteredBooks
    }

    // public static mapBookCount(bookCounter: BooksCounter, books: Book[]): BookWithCount | null {
    //      const book = books.find(b => b.id === bookCounter.id);
    //      return book ? {book, count: bookCounter.count} : null;
    // }
}
