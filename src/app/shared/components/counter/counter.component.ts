import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
    map,
    merge,
    Observable,
    ReplaySubject,
    scan,
    share,
    shareReplay,
    startWith,
    Subject, takeUntil,
    tap
} from "rxjs";
import {MatButtonModule} from "@angular/material/button";

@Component({
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnDestroy{
    @Input() initialText: string;
    @Input() set counterValue(value:number) {
        this.counterValue$.next(value)
    }
    @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();

    currentValue$: Observable<string>;

    rightArrowClick$: Subject<void> = new Subject<void>();
    leftArrowClick$: Subject<void> = new Subject<void>();
    manualChange$: Subject<string> = new Subject<string>();
    buttonClick$: Subject<void> = new Subject<void>();
    counterValue$: ReplaySubject<number> = new ReplaySubject<number>(1);
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor() {
            this.currentValue$ = merge(
                this.rightArrowClick$.pipe(map(_ => ({action: 'plus', payload: null}))),
                this.leftArrowClick$.pipe(map(_ => ({action: 'minus', payload: null}))),
                this.manualChange$.pipe(map(num => ({action: 'eq', payload: num}))),
                this.counterValue$.pipe(map(num => ({action: 'initial', payload: num}))),
            ).pipe(
                scan((acc, cur) => {
                    let newValue;
                    switch (cur.action) {
                        case 'plus':
                            newValue = Number(acc) + 1;
                            break;
                        case 'minus':
                            newValue = Number(acc) - 1;
                            break;
                        case 'eq':
                            newValue = cur.payload;
                            break;
                        case 'initial':
                            newValue = cur.payload;
                            break;
                    }
                    return String(newValue)
                }, 0),
                startWith('0'),
                share(),
                shareReplay({refCount: true, bufferSize: 1})
            )

        this.initializeSideEffects();
    }

    private initializeSideEffects(): void {
        this.buttonClick$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(_ => {
            this.rightArrowClick$.next();
        })

        this.currentValue$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(changedInputValue => {
            this.counterChange.emit(Number(changedInputValue));
        })

    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

}
