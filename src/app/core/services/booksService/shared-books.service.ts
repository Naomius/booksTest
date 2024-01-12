import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {Book} from "../facadesManagement/books.facade.service";
import {ApiBooksService} from "../apiService/apiBooks.service";

@Injectable({
  providedIn: 'root'
})
export class SharedBooksService {

    private readonly cartBooks$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private apiBooksService: ApiBooksService) { }

    getBooks(): Observable<Book[]> {
        return this.apiBooksService.getBooks().pipe(
            map(json => json.books.map(book => ({
                ...book,
                price: Number(book.price.replace(/[^0-9\.-]+/g, ""))
            })))
        );
    }

    updateCounterValue(newValue: number): void {
        this.cartBooks$.next(newValue);
    }

    get counterValue(): BehaviorSubject<number> {
        return this.cartBooks$;
    }


}
