import {Injectable} from "@angular/core";
import {IBook} from "../interfaces/IBook";
import {ApiBooksService} from "../../../services/apiBooks.service";
import {BehaviorSubject, map} from "rxjs";


@Injectable()
export class MainFacadeService {
    //возможно стартанут с of
    private currentBooks$: IBook[] = new BehaviorSubject<IBook[]>([]);

    constructor(private booksService: ApiBooksService) {
    }

    setCurrentBooks(): void {
       this.booksService.getBooks()
           .pipe(map(b => b.books))
           .subscribe({
               next: (book: IBook[]) => {
                   this.currentBooks$ = book;
               }
           })
    }
    get booksAmount(): IBook[] {
        return this.currentBooks$;
    }
}
