import {Injectable} from "@angular/core";
import {IBookManager} from "../../../base/book/book.component";
import {SharedBooksService} from "../booksService/shared-books.service";
import {BehaviorSubject, map, Observable, Subject, switchMap} from "rxjs";
import {Book, BooksId} from "./books.facade.service";
import {CartStoreService} from "../cartStore.service";

@Injectable()
export class BookFacadeService implements IBookManager{

    private readonly currentBook$: Observable<Book>;
    private readonly getBookById$: Subject<number> = new BehaviorSubject<number>(null);
    constructor(private sharedBooksService: SharedBooksService,
                private cartService: CartStoreService) {
        this.currentBook$ = this.getBookById$.pipe(
            switchMap(id => {
                return this.sharedBooksService.getBooks().pipe(
                    map(books => books.find(book => book.id === id)),
                )
            }),
        )
    }
    updateCart(booksId: BooksId): void {
        this.cartService.updateCart(booksId);
    }
    getBookId(id: number): void {
        this.getBookById$.next(id);
    }

    get Book(): Observable<Book> {
        return this.currentBook$;
    }

}

