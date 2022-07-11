import ListViewScrollListener from './list-view-scroll-listener';
import { ListView } from "@nativescript/core";

@NativeClass()
class ListViewScrollListenerDelegateImpl extends NSObject implements UITableViewDelegate {

  public static ObjCProtocols = [UITableViewDelegate];

  private lv: ListView;
  private sl: ListViewScrollListener

  public static initWithOriginalDelegate(listView: ListView, sl: ListViewScrollListener): ListViewScrollListenerDelegateImpl {
    const originalDelegate = (<any>listView)._delegate as UITableViewDelegate;

    const delegate = <ListViewScrollListenerDelegateImpl>ListViewScrollListenerDelegateImpl.new();

    delegate.lv = listView;
    delegate.sl = sl;

    return delegate;
  }

  public scrollViewDidScroll(scrollView: UIScrollView): void {
    this.sl.setState('scrolling');
  }

  public scrollViewWillBeginDragging(scrollView:UIScrollView){
    this.sl.setState('dragging');
  }
}

export { ListViewScrollListenerDelegateImpl }
