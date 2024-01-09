import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiBooksService{

    constructor(private http: HttpClient) {
    }


    public getBooks(): Observable<IJson> {
        return this.http.get<IJson>('/assets/books.json');
    }


}

export interface IJson {
    error?: string,
    total?: string,
    books: Book[]
}

export interface Book{
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: string,
    image: string,
    url: string,
}
