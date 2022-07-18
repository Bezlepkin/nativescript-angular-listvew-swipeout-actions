import { Component, OnInit } from "@angular/core";
import {
  CoreTypes,
  GestureTypes,
  isAndroid,
  isIOS,
  ItemEventData,
  Label,
  ListView,
  LoadEventData,
  PanGestureEventData,
  Screen,
  StackLayout,
  TapGestureEventData,
  View,
} from "@nativescript/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import ListViewScrollListener from "../utils/list-view-scroll-listener";
import { addScrollListener } from "../utils/list-view.ios";
import { ListViewScrollEventData } from "nativescript-ui-listview";

@Component({
  selector: "ns-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.scss"],
})
export class ItemsComponent implements OnInit {
  items: Array<Item>;
  isScrollEnabled: boolean;
  prevIndex: number;

  private isActiveScroll: boolean;
  private isOpenSwipeout: boolean;
  private swipeoutActionItems: View[] = [];
  private listView: ListView;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.items = this.itemService.getItems();
  }

  onListViewLoaded(args: LoadEventData): void {
    this.listView = <ListView>args.object;

    if (isIOS) {
      const sl = new ListViewScrollListener();

      addScrollListener(this.listView, sl);
      sl.getState().subscribe((state) => {
        if (state === "dragging") {
          this.isActiveScroll = true;
          this.prevIndex = -1;
        }
      });
    }
  }

  onListViewItemLoading(args: ItemEventData): void {
    if (isIOS) {
      const cell = args.ios;
      cell.selectionStyle = UITableViewCellSelectionStyle.None;
    }
  }

  onListViewPan(args: PanGestureEventData): void {
    if (args.state === 3) {
      this.isActiveScroll = false;
    }
  }

  onPrevIndexChanged(index: number): void {
    this.prevIndex = index >= 0 ? index : -1;
  }

  onSwipeProgressStarted(index: number): void {
    this.disableScroll();
  }

  onSwipeProgressFinished(index: number): void {
    this.enableScroll();
  }

  async closeSpecificSwipeActionItem(swipeActionindex: number): Promise<void> {
    try {
      const swipeActionItem = this.swipeoutActionItems[swipeActionindex];
      await swipeActionItem.animate({
        width: 0,
        duration: 500,
        curve: CoreTypes.AnimationCurve.easeOut,
      });
    } catch (e) {
      console.log(e);
    }
  }

  private disableScroll(): void {
    if (!this.listView) return;

    if (isIOS) {
      this.listView.ios.scrollEnabled = false;
    }
  }

  private enableScroll(): void {
    if (!this.listView) return;

    if (isIOS) {
      this.listView.ios.scrollEnabled = true;
    }
  }
}
