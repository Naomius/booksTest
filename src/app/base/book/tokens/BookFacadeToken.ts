import {InjectionToken} from "@angular/core";
import {IBookManager} from "../book.component";

export const BookFacadeToken = new InjectionToken<IBookManager>('BookFacadeToken')
