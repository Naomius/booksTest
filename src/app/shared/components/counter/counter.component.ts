import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {map, merge, Observable, scan, share, shareReplay, startWith, Subject, tap} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {SharedBooksService} from "../../../core/services/booksService/shared-books.service";

@Component({
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
    @Input() initialText: string;
    @Input() counterValue$: Observable<number>;
    @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();

    currentValue$: Observable<string>;

    rightArrowClick$: Subject<void> = new Subject<void>();
    leftArrowClick$: Subject<void> = new Subject<void>();
    manualChange$: Subject<string> = new Subject<string>();
    buttonClick$: Subject<void> = new Subject<void>();

    constructor(private shareService: SharedBooksService) {
        if (this.counterValue$) {
            this.counterValue$.subscribe(console.log);
        }
        this.currentValue$ = merge(
            this.rightArrowClick$.pipe(map(_ => ({action: 'plus', payload: null}))),
            this.leftArrowClick$.pipe(map(_ => ({action: 'minus', payload: null}))),
            this.manualChange$.pipe(map(num => ({action: 'eq', payload: num})))
        ).pipe(
            scan((acc, cur) => {
                let newValue;
                switch (cur.action) {
                    case 'plus': newValue = Number(acc) + 1; break;
                    case 'minus': newValue = Number(acc) - 1; break;
                    case 'eq': newValue = cur.payload; break;
                }
                return String(newValue)
            },0),
            startWith('0'),
            share(),
            shareReplay({refCount: true, bufferSize: 1})
        )

        this.initializeSideEffects();
    }



    private initializeSideEffects(): void {
        this.buttonClick$.subscribe(_ => {
            this.rightArrowClick$.next();
        })

        this.currentValue$.subscribe(changedInputValue => {
            this.counterChange.emit(Number(changedInputValue));
        })
    }

}
