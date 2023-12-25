import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiBooksService{

    constructor(private http: HttpClient) {
    }


    public get Books(): Observable<IJson> {
        return this.http.get<IJson>('/assets/books.json');
    }

    public getBookById(id: number): Observable<Book | undefined> {
        return this.Books.pipe(
            map((data: IJson) => {
                if (data.books) {
                    return data.books.find(book => book.id === id)
                }

                return undefined;
            }),
            catchError((error) => {
                console.error('Не книги с таким id', error)
                return of(undefined);
            })
        )
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
