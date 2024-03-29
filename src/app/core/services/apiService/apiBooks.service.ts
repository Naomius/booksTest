import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiBooksService{

    constructor(private http: HttpClient) {
    }

    public getBooks(): Observable<ApiData> {
        return this.http.get<ApiData>('/assets/books.json');
    }

}

export interface ApiData {
    error?: string,
    total?: string,
    books: BookResponse[]
}

export interface BookResponse {
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: string,
    image: string,
    url: string,
}
