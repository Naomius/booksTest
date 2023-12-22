import {Component, Inject} from '@angular/core';
import {BookFacadeService} from "../../core/services/facadesManagement/book.facade.service";
import {BookFacadeToken} from "./tokens/BookFacadeToken";

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss'],
    providers: [
        BookFacadeService,
        {provide: BookFacadeToken, useExisting: BookFacadeService}
    ]
})
export class BookComponent {

    constructor(@Inject(BookFacadeToken) private bookFacadeService: IBookManager) {
    }

}

export interface IBookManager {
    //methods from Facade
}
