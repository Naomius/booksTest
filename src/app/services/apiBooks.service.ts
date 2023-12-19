import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IBook} from "../base/main/interfaces/IBook";

@Injectable({
  providedIn: 'root'
})
export class ApiBooksService {

  constructor(private http: HttpClient) {
  }

  public getBooks(): Observable<IJson> {
    return this.http.get<IJson>('/assets/books.json')
  }

}

export interface IJson {
    error?: string,
    total?: string,
    books: IBook[]
}
