import {Book} from "../../base/books/books.component";
import {Sort} from "@angular/material/sort";


export class BooksFacadeHelper {
    public static sortBooks(booksAndCount: BookAndCount[], sortEvent?: Sort): BookAndCount[] {

        if (sortEvent && sortEvent.active && sortEvent.direction) {
            return booksAndCount.sort((a, b) => {
                const valueA = a.book[sortEvent.active];
                const valueB = b.book[sortEvent.active];

                let comparison = 0;
                if (valueA != null && valueB != null) {
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        comparison = valueA.toUpperCase().localeCompare(valueB.toUpperCase());
                    } else {
                        comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                    }
                }

                return sortEvent.direction === 'asc' ? comparison : -comparison;
            });
        }

        return booksAndCount;
    }

}

interface BookAndCount {
    book: Book;
    count: number;
}
