import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Book} from "../../../base/books/interfaces/IBook";
import {ApiBooksService} from "../apiService/apiBooks.service";
import {IBooksManager} from "../../../base/books/books.component";


@Injectable()
export class BooksFacadeService implements IBooksManager {

    private readonly currentBooks$!: Observable<Book[]>;

    constructor(private booksService: ApiBooksService) {
        this.currentBooks$ = this.booksService.Books.pipe(
            map(b => b.books),
        );
    }

    get Books(): Observable<Book[]> {
        return this.currentBooks$;
    }

}
