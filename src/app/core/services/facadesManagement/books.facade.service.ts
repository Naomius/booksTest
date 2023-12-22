import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {Book} from "../../../base/books/interfaces/IBook";
import {ApiBooksService} from "../apiService/apiBooks.service";
import {BooksCounter, IBooksManager} from "../../../base/books/books.component";
import {GeneralBooksAndCartService} from "../../../base/services/general-books-and-cart.service";


@Injectable()
export class BooksFacadeService implements IBooksManager {

    private readonly currentBooks$!: Observable<Book[]>;

    constructor(private booksService: ApiBooksService,
                private generalBooksAndCartService: GeneralBooksAndCartService) {
        this.currentBooks$ = this.booksService.Books.pipe(
            map(b => b.books),
        );
    }

    updateBooksCounter(newCounter: BooksCounter): void {
        this.generalBooksAndCartService.updateBooksCounter(newCounter);
    }

    get Books(): Observable<Book[]> {
        return this.currentBooks$;
    }

}
