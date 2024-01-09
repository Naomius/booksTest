import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Book} from "../facadesManagement/books.facade.service";
import {ApiBooksService} from "../apiService/apiBooks.service";

@Injectable({
  providedIn: 'root'
})
export class SharedBooksService {

  constructor(private apiBooksService: ApiBooksService) { }

    getBooks(): Observable<Book[]> {
        return this.apiBooksService.getBooks().pipe(
            map(json => json.books.map(book => ({
                ...book,
                price: Number(book.price.replace(/[^0-9\.-]+/g, ""))
            })))
        );
    }


}
