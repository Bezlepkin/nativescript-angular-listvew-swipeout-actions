import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  CoreTypes,
  isAndroid,
  Label,
  LoadEventData,
  PanGestureEventData,
  StackLayout,
  TapGestureEventData,
  View,
} from "@nativescript/core";

export enum Direction {
  Left = "left",
  Right = "right",
}

@Component({
  selector: "app-swipeout",
  templateUrl: "./swipeout.component.html",
  styleUrls: ["./swipeout.component.scss"],
})
export class SwipeoutComponent implements OnInit, OnChanges {
  direction: Direction;
  swipeoutActionsItemWidth: number;
  swipeoutActionsItemHeight: number;

  swipeoutItems: Array<any> = [];

  private isOpened: boolean;
  private prevDeltaX: number;
  private swipeout: View;

  @Input("index") private _index: number;
  @Input("prevIndex") private _prevIndex: number;
  @Input("disabled") private _disabled: boolean;

  @Input("title") private _title: string;
  @Input("text") private _text: string;

  @Output("prevIndexChanged") private prevIndexChangedEvent =
    new EventEmitter<number>();
  @Output("swipeProgressStarted") private swipeProgressStartedEvent =
    new EventEmitter<number>();
  @Output("swipeProgressFinished") private swipeProgressFinishedEvent =
    new EventEmitter<number>();

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes._prevIndex && changes._prevIndex.currentValue >= 0) ||
      (changes._prevIndex && changes._prevIndex.currentValue === -1)
    ) {
      // if there is a swipe not with the current element, then close it
      if (this.index !== this.prevIndex) {
        this.close(this.swipeout);
      }
    }
  }

  get index(): number {
    return this._index;
  }

  get prevIndex(): number {
    if (this._prevIndex >= 0) {
      return this._prevIndex;
    }
  }

  get disabled(): boolean {
    return !!this._disabled;
  }

  set prevIndex(index: number) {
    this.prevIndexChangedEvent.emit(index);
  }

  get title(): string {
    return this._title;
  }

  get text(): string {
    return this._text;
  }

  onListItemLoaded(args: LoadEventData): void {
    if (this.swipeoutActionsItemWidth && this.swipeoutActionsItemHeight) {
      return;
    }

    setTimeout(() => {
      const actionView = args.object as StackLayout;
      this.swipeoutActionsItemWidth = actionView.getMeasuredHeight() / 2;
      this.swipeoutActionsItemHeight = actionView.getMeasuredHeight() / 2;
    }, 0);
  }

  onSwipeoutActionsLabelLoaded(args: LoadEventData): void {
    const lbl = args.object as Label;
    if (isAndroid) {
      lbl.android.setGravity(17);
    }
  }

  onSwipeoutLoaded(args: LoadEventData): void {
    this.swipeout = <View>args.object;
  }

  onTap(args: TapGestureEventData): void {
    if (this.prevIndex >= 0 && this.prevIndex !== this.index) {
      this.prevIndex = undefined;
    }
  }

  async onPanListItem(args: PanGestureEventData): Promise<void> {
    if (this.disabled) {
      return;
    }

    const swipeout = this.swipeout;
    if (args.state === 1) {
      this.prevDeltaX = 0;
      this.swipeProgressStartedEvent.emit(this.index);
    } else if (args.state === 2) {
      this.prevIndex = this.index;
      if (args.view.translateX !== 0) {
        // console.log(args.view.translateX);
        //this.isOpened = false;
      }
      const x = args.view.translateX + args.deltaX - this.prevDeltaX;

      if (x < 0) {
        this.direction = Direction.Left;
      } else if (x > 0) {
        this.direction = Direction.Right;
      }

      if (args.deltaX < 0) {
        args.view.translateX = x;
      } else if (args.deltaX > 0) {
        // args.view.translateX = args.deltaX ** 0.6;
        if (x > 0) {
          args.view.translateX = (args.deltaX - this.prevDeltaX) ** 0.6;
          return;
        }
      }

      args.view.translateX = x;

      this.prevDeltaX = args.deltaX;
      // this.prevIndex = this.index;
    } else if (args.state === 3) {
      const listItemHeight = swipeout.getMeasuredHeight() / 2;

      if (
        swipeout.translateX < listItemHeight / -2 ||
        swipeout.translateX < listItemHeight * -1
      ) {
        this.open(this.swipeout);
      } else {
        this.close(this.swipeout);
      }

      this.isOpened = true;
      this.swipeProgressFinishedEvent.emit(this.index);
    }
  }

  private open(el: View): void {
    const listItemHeight = el.getMeasuredHeight() / 2;
    el.animate({
      translate: { x: listItemHeight * -1, y: 0 },
      duration: 150,
      curve: CoreTypes.AnimationCurve.easeOut,
    });
  }

  async close(el: View): Promise<void> {
    try {
      if (el.translateX === 0) return;

      await el.animate({
        translate: { x: 0, y: 0 },
        duration: 100,
        curve: CoreTypes.AnimationCurve.easeOut,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
