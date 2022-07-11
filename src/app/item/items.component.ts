import { Component, OnInit } from "@angular/core";
import {
  CoreTypes,
  GestureTypes,
  isAndroid,
  isIOS,
  Label,
  ListView,
  LoadEventData,
  PanGestureEventData,
  StackLayout,
  TapGestureEventData,
  View,
} from "@nativescript/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import ListViewScrollListener from "../utils/list-view-scroll-listener";
import { addScrollListener } from "../utils/list-view.ios";

@Component({
  selector: "ns-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.scss"],
})
export class ItemsComponent implements OnInit {
  items: Array<Item>;
  swipeoutActionsItemWidth: number;
  swipeoutActionsItemHeight: number;

  private isActiveScroll: boolean;
  private prevItemIndex: number;
  private prevDeltaX: number;
  private swipeoutItems: View[] = [];
  private swipeoutActionItems: View[] = [];


  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.items = this.itemService.getItems();
  }

  onListViewLoaded(args: LoadEventData): void {
    const listview = <ListView>args.object;

    if (isIOS) {
      const sl = new ListViewScrollListener();
      addScrollListener(listview, sl);
      sl.getState().subscribe((state) => {
        this.isActiveScroll = true;
      });
    }
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

  onSwipeoutLoaded(args: LoadEventData): void {
    const swipeout = <View>args.object;
    this.swipeoutItems.push(swipeout);
  }

  onSwipeoutActionLoaded(args: LoadEventData): void {
    const swipeoutAction = <View>args.object;
    swipeoutAction.translateX = 60;
    this.swipeoutActionItems.push(swipeoutAction);
  }

  onSwipeoutActionsLabelLoaded(args: LoadEventData): void {
    const lbl = args.object as Label;
    if (isAndroid) {
      lbl.android.setGravity(17);
    }
  }

  onListViewPan(args: PanGestureEventData): void {
    if (args.state === 3) {
      this.isActiveScroll = false;
    }
  }

  onTapListItem(itemIndex: number, args: TapGestureEventData): void {
    if (this.prevItemIndex >= 0 && this.prevItemIndex !== itemIndex) {
      this.closeAllswipItems();
      this.prevItemIndex = undefined;
    }
  }

  async onPanListItem(itemIndex: number, args: PanGestureEventData): Promise<void> {
    if (this.isActiveScroll) {
      return;
    }

    const currSwipeItem = this.swipeoutItems[itemIndex];

    if (args.state === 1) {
      if (this.prevItemIndex >= 0 && this.prevItemIndex !== itemIndex) {
        this.closeSpecificSwipeItem(this.prevItemIndex);
      }

      this.prevDeltaX = 0;
    } else if (args.state === 2) {
      const translateX = (args.view.translateX +=
        args.deltaX - this.prevDeltaX);
      this.swipeoutActionItems[itemIndex].width = Math.abs(translateX);

      if (currSwipeItem.translateX > 0) {
        args.view.translateX = 0;
      }

      if (args.view.translateX < 0) {
        // this.scrollView.isScrollEnabled = false;
      }

      this.prevDeltaX = args.deltaX;
      this.prevItemIndex = itemIndex;
      console.log(this.prevItemIndex);
    } else if (args.state === 3) {
      const listItemHeight = currSwipeItem.getMeasuredHeight() / 2;

      if (
        currSwipeItem.translateX < listItemHeight / -2 ||
        currSwipeItem.translateX < listItemHeight * -1
      ) {
        this.openSpecificSwipeItem(currSwipeItem);
      } else {
        this.closeSpecificSwipeItem(itemIndex);
      }

      // this.scrollView.isScrollEnabled = true;
    }
  }

  private openSpecificSwipeItem(el: View): void {
    const listItemHeight = el.getMeasuredHeight() / 2;
    el.animate({
      translate: { x: listItemHeight * -1, y: 0 },
      duration: 150,
      curve: CoreTypes.AnimationCurve.easeOut,
    });
  }

  async closeSpecificSwipeItem(swipeItemIndex: number): Promise<void> {
    try {
      const swipeItem = this.swipeoutItems[swipeItemIndex];
      await swipeItem.animate({
        translate: { x: 0, y: 0 },
        duration: 100,
        curve: CoreTypes.AnimationCurve.easeOut,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async closeSpecificSwipeActionItem(
    swipeActionItemIndex: number
  ): Promise<void> {
    try {
      const swipeActionItem = this.swipeoutActionItems[swipeActionItemIndex];
      await swipeActionItem.animate({
        width: 0,
        duration: 500,
        curve: CoreTypes.AnimationCurve.easeOut,
      });
    } catch (e) {
      console.log(e);
    }
  }

  private async closeAllswipItems(): Promise<void> {
    const items = this.swipeoutItems;
    for (let i = 0; i < items.length; i++) {
      if (items[i].translateX == 0) {
        continue;
      }
      this.closeSpecificSwipeItem(i);
      // this.closeSpecificSwipeActionItem(i);
    }
  }


  onPanSwipeout(args: PanGestureEventData): void {
    if (this.isActiveScroll) {
      return;
    }
    if (args.state === 2) {
      console.log("DeltaX", args.deltaX);
      console.log("DeltaY", args.deltaY);
    }
  }
}
