import {Injectable} from "@angular/core";
import {IBookManager} from "../../../base/book/book.component";
import {SharedBooksService} from "../booksService/shared-books.service";
import {BehaviorSubject, map, Observable, Subject, switchMap, tap} from "rxjs";
import {Book} from "./books.facade.service";

@Injectable()
export class BookFacadeService implements IBookManager{

    private readonly currentBook$: Observable<Book>;
    private readonly getBookById$: Subject<number> = new BehaviorSubject<number>(null);
    constructor(private sharedBooksService: SharedBooksService) {
        this.currentBook$ = this.getBookById$.pipe(
            switchMap(id => {
                return this.sharedBooksService.getBooks().pipe(
                    map(books => books.find(book => book.id === id)),
                )
            }),
        )
    }

    getBookId(id: number): void {
        this.getBookById$.next(id);
    }

    get Book(): Observable<Book> {
        return this.currentBook$;
    }

}

