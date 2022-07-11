import { BehaviorSubject, Observable } from "rxjs";

export default class ListViewScrollListener {
  private state$ = new BehaviorSubject<string>(null);

  scrolled (currentPos: number): void {
    console.log('LISTVIEW: scrolled: ' + currentPos);
    this.setState('scroll');
  }

  getState(): Observable<string> {
    return this.state$.asObservable();
  }

  setState(value: string): void {
    this.state$.next(value);
  }
}