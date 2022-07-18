import { ListView } from '@nativescript/core';
import ListViewScrollListener from './list-view-scroll-listener';
import { ListViewScrollListenerDelegateImpl } from './list-view-ios-delegate';
export const addScrollListener = (
  listVew: ListView,
  scrollListener: ListViewScrollListener
) => {
  const newDelegate =
    ListViewScrollListenerDelegateImpl.initWithOriginalDelegate(
      new WeakRef(listVew),
      scrollListener
    );
  (<any>listVew)._delegate = newDelegate;
};
