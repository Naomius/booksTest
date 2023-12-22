import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Book} from "../../../base/books/interfaces/IBook";

@Injectable({
  providedIn: 'root'
})
export class ApiBooksService{

    constructor(private http: HttpClient) {
    }


  public get Books(): Observable<IJson> {
      return this.http.get<IJson>('/assets/books.json');
  }

}

export interface IJson {
    error?: string,
    total?: string,
    books: Book[]
}
