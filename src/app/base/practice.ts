// // // import {Injectable} from '@angular/core';
// // // import {BehaviorSubject, map, merge, Observable, scan, Subject, tap} from "rxjs";
// // //
// // // @Injectable({
// // //     providedIn: 'root'
// // // })
// // // export class CartStoreService {
// // //     private booksInCartSubject$ = new BehaviorSubject<BookDetails[]>([]);
// // //     private bookAdditionSubject$ = new Subject<BookDetails>();
// // //     private bookRemovalSubject$ = new Subject<number>();
// // //
// // //     constructor() {
// // //         const cartUpdate$ = merge(
// // //             this.bookAdditionSubject$.pipe(map(book => (cart: BookDetails[]) => this._addBook(cart, book))),
// // //             this.bookRemovalSubject$.pipe(map(bookId => (cart: BookDetails[]) => this._removeBook(cart, bookId)))
// // //         );
// // //
// // //         cartUpdate$.pipe(
// // //             scan((books: BookDetails[], operator: (books: BookDetails[]) => BookDetails[]) => operator(books), []),
// // //             tap(updatedBooks => this.booksInCartSubject$.next(updatedBooks)),
// // //             tap(console.log)
// // //         ).subscribe();
// // //     }
// // //
// // //     addToCart(book: BookDetails): void {
// // //         this.bookAdditionSubject$.next(book);
// // //     }
// // //
// // //     removeFromCart(bookId: number): void {
// // //         this.bookRemovalSubject$.next(bookId);
// // //     }
// // //
// // //     private _addBook(books: BookDetails[], bookToAdd: BookDetails): BookDetails[] {
// // //         const bookIndex = books.findIndex(book => book.id === bookToAdd.id);
// // //         if (bookIndex !== -1) {
// // //             const updatedBooks = [...books];
// // //             updatedBooks[bookIndex].count += bookToAdd.count;
// // //             return updatedBooks;
// // //         } else {
// // //             return [...books, bookToAdd];
// // //         }
// // //     }
// // //
// // //     private _removeBook(books: BookDetails[], bookIdToRemove: number): BookDetails[] {
// // //         return books.filter(book => book.id !== bookIdToRemove);
// // //     }
// // //
// // //     get booksInCart$(): Observable<BookDetails[]> {
// // //         return this.booksInCartSubject$.asObservable();
// // //     }
// // // }
// // //
// // //
// // // export interface BookDetails{
// // //     id: number,
// // //     title: string,
// // //     subtitle: string,
// // //     isbn13: string,
// // //     price: string,
// // //     image: string,
// // //     url: string,
// // //     count?: number,
// // // }
// // //
// // // // export interface BooksCounter {
// // // //     id: number,
// // // //     count: number,
// // // // }
// // //
// //
// //
// // //Фасад
// //
// // import {Injectable} from "@angular/core";
// // import {filter, map, Observable, Subject, tap} from "rxjs";
// // import {ApiBooksService} from "../apiService/apiBooks.service";
// // import {IBooksManager} from "../../../base/books/books.component";
// // import {CartStoreService} from "../../../base/services/cartStore.service";
// // import {BookDetails} from "../../../base/books/interfaces/IBook";
// //
// //
// // @Injectable()
// // export class BooksFacadeService implements IBooksManager {
// //
// //
// //     constructor(private apiBooksService: ApiBooksService,
// //                 private cartStoreService: CartStoreService) {
// //     }
// //
// //     // addBooksToCart(bookId: number, count: number): void {
// //     //     const book = { id: bookId, count }
// //     //     this.cartStoreService.addToCart(book, count);
// //     // }
// //
// //     addBooksToCart(bookId: number, count: number): void {
// //         const unsubscribe$ = new Subject<void>();
// //
// //         this.apiBooksService.Books.pipe(
// //             map(json => json.books),
// //             map(books => books.find(book => book.id === bookId)),
// //             filter((bookDetails): bookDetails is BookDetails => bookDetails !== undefined),
// //         ).subscribe(bookDetails => {
// //             const bookToAdd: CartBookDetails  = {
// //                 ...bookDetails,
// //                 count: count
// //             };
// //             this.cartStoreService.addToCart(bookToAdd);
// //             unsubscribe$.next();
// //             unsubscribe$.complete();
// //         });
// //     }
// //
// //     removeBooksFromCart(bookId: number): void {
// //         this.cartStoreService.removeFromCart(bookId)
// //     }
// //
// //     getBooks(): Observable<Book[]> {
// //         return this.apiBooksService.Books.pipe(
// //             map(json => json.books),
// //         );
// //     }
// //
// // }
// //
// // export interface Book {
// //     id: number,
// //     title: string,
// //     subtitle: string,
// //     isbn13: string,
// //     price: string,
// //     image: string,
// //     url: string,
// // }
// //
// // export interface CartBookDetails extends BookDetails {
// //     count: number;
// // }
// //
//
//
//
// //Компонент
//
//
// import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
// import {filter, map, merge, Observable, Subject, takeUntil, tap, withLatestFrom} from "rxjs";
// import {Sort} from "@angular/material/sort";
// import {BooksFacadeService} from "../../core/services/facadesManagement/books.facade.service";
// import {BooksFacadeToken} from "./tokens/booksFacadeToken";
//
// @Component({
//     selector: 'app-books',
//     templateUrl: './books.component.html',
//     styleUrls: ['./books.component.scss'],
//     providers: [
//         BooksFacadeService,
//         {provide: BooksFacadeToken, useExisting: BooksFacadeService}
//     ]
// })
// export class BooksComponent implements OnInit, OnDestroy {
//     @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
//
//     public error = '';
//     public isLoading = false;
//     displayedColumns: string[] = ['position', 'image', 'name', 'price', 'description', 'buy'];
//
//     public books$!: Observable<Book[]>;
//     public sortedBooks$: Observable<Book[]>;
//     public filteredBooks$: Observable<Book[]>;
//
//     public bookCounterChange$: Subject<BooksCounter> = new Subject<BooksCounter>;
//     public filterBooks$: Subject<string> = new Subject<string>();
//     public sortBooks$: Subject<Sort> = new Subject<Sort>();
//     private unsubscribe$: Subject<void> = new Subject<void>();
//
//
//     constructor(@Inject(BooksFacadeToken) private mainFacadeService: IBooksManager) {
//     }
//
//
//     ngOnInit(): void {
//         this.books$ = this.mainFacadeService.getBooks();
//         this.filteredBooks$ = merge(
//             this.books$,
//             this.filterBooks$.pipe(
//                 withLatestFrom(this.books$),
//                 map(([searchStr, books]) => {
//                     if (!searchStr.trim()) {
//                         return books;
//                     } else {
//                         return books.filter(book => book.title.toLocaleLowerCase()
//                                 .includes(searchStr.toLowerCase())
//                             || book.subtitle.toLocaleLowerCase().includes(searchStr.toLowerCase()))
//                     }
//                 })
//             )
//         );
//
//         this.sortedBooks$ = merge(
//             this.filteredBooks$,
//             this.sortBooks$.pipe(
//                 withLatestFrom(this.filteredBooks$),
//                 map(([sortEvent, books]) => {
//                     const booksData = books.slice();
//                     if (!sortEvent.active || sortEvent.direction === '') {
//                         return booksData
//                     } else {
//                         return booksData.sort(this._compare(sortEvent.active, sortEvent.direction === 'asc'))
//                     }
//                 })
//             )
//         )
//
//         this.initializeSideEffects();
//     }
//
//     private _compare(key: string, isAsc: boolean) {
//         return (a: Book, b: Book) => {
//             if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
//                 return 0;
//             }
//
//             const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
//             const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
//
//             let comparison = 0;
//             if (varA > varB) {
//                 comparison = 1;
//             } else if (varA < varB) {
//                 comparison = -1;
//             }
//             return (isAsc ? comparison : (comparison * -1));
//         };
//     }
//
//     public cleanSearchInput(): void {
//         this.filterBooks$.next('');
//         this.filterInput.nativeElement.value = '';
//     }
//
//     private initializeSideEffects(): void {
//         this.bookCounterChange$.pipe(
//             withLatestFrom(this.books$),
//             map(([bookCounter, books]) => {
//                 const book = books.find(b => b.id === bookCounter.id);
//                 return book ? {...book, count: bookCounter.count} : null;
//             }),
//             filter(bookCount => bookCount !== null),
//             takeUntil(this.unsubscribe$)
//         ).subscribe(bookCount => {
//             if (bookCount && bookCount.count) {
//                 this.mainFacadeService.addBooksToCart(bookCount.id, bookCount.count);
//                 console.log(`Заказали книгу по id ${bookCount.id} в кол-ве ${bookCount.count} шт.`)
//             } else if (bookCount) {
//                 this.mainFacadeService.removeBooksFromCart(bookCount.id);
//                 console.log(`Убрали из заказа книгу по id ${bookCount.id}`);
//             }
//         })
//     }
//
//     ngOnDestroy(): void {
//         this.unsubscribe$.next();
//         this.unsubscribe$.complete();
//     }
//
// }
//
// export interface IBooksManager {
//     getBooks(): Observable<Book[]>,
//     addBooksToCart(id: number, count: number): void,
//     removeBooksFromCart(bookId: number): void,
// }
//
// export interface Book {
//     id: number,
//     title: string,
//     subtitle: string,
//     isbn13: string,
//     price: string,
//     image: string,
//     url: string,
// }
//
// export interface BooksCounter {
//     id: number,
//     count: number,
// }
