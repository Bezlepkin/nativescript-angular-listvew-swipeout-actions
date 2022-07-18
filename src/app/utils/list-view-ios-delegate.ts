import ListViewScrollListener from "./list-view-scroll-listener";
import { ListView } from "@nativescript/core";

@NativeClass()
class ListViewScrollListenerDelegateImpl
  extends NSObject
  implements UITableViewDelegate
{
  public static ObjCProtocols = [UITableViewDelegate];

  private owner: WeakRef<ListView>;
  private originalDelegate: any;
  private scrollListener: ListViewScrollListener;

  public static initWithOriginalDelegate(
    owner: WeakRef<ListView>,
    scrollListener: ListViewScrollListener
  ): ListViewScrollListenerDelegateImpl {
    const delegate = <ListViewScrollListenerDelegateImpl>(
      ListViewScrollListenerDelegateImpl.new()
    );

    delegate.owner = owner;
    delegate.originalDelegate = (<any>owner.get())._delegate;
    delegate.scrollListener = scrollListener;

    return delegate;
  }

  public tableViewWillSelectRowAtIndexPath(
    tableView: UITableView,
    indexPath: NSIndexPath
  ): NSIndexPath {
    return this.originalDelegate.tableViewWillSelectRowAtIndexPath(
      tableView,
      indexPath
    );
  }

  public tableViewDidSelectRowAtIndexPath(
    tableView: UITableView,
    indexPath: NSIndexPath
  ): NSIndexPath {
    return this.originalDelegate.tableViewDidSelectRowAtIndexPath(
      tableView,
      indexPath
    );
  }

  public tableViewHeightForRowAtIndexPath(
    tableView: UITableView,
    indexPath: NSIndexPath
  ): number {
    return this.originalDelegate.tableViewHeightForRowAtIndexPath(
      tableView,
      indexPath
    );
  }

  public scrollViewDidScroll(scrollView: UIScrollView): void {
    this.scrollListener.setState("scrolling");
  }

  public scrollViewWillBeginDragging(scrollView: UIScrollView) {
    this.scrollListener.setState("dragging");
  }
}

export { ListViewScrollListenerDelegateImpl };
