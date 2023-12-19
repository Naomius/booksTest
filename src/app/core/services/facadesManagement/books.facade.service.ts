import {Injectable} from "@angular/core";
import {IBook} from "../interfaces/IBook";
import {ApiBooksService} from "../../../services/apiBooks.service";
import {BehaviorSubject, map} from "rxjs";


@Injectable()
export class BooksFacadeService {
    //возможно стартанут с of
    private readonly currentBooks$: BehaviorSubject<IBook[]> = new BehaviorSubject<IBook[]>([]);

    constructor(private booksService: ApiBooksService) {
    }

    setCurrentBooks(): void {
       this.booksService.getBooks()
           .pipe(map(b => b.books))
           .subscribe({
               next: (book: IBook[]) => {
                   this.currentBooks$.next(book)
               }
           })
    }
    get booksAmount(): BehaviorSubject<IBook[]> {
        return this.currentBooks$;
    }
}
