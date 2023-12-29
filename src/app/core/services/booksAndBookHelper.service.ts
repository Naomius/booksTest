import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BooksAndBookHelperService {
    private selectedBookSubject = new BehaviorSubject<Book | null>(null);
    selectedBookAction$ = this.selectedBookSubject.asObservable();

    selectBook(book: Book): void {
        this.selectedBookSubject.next(book);
    }

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
