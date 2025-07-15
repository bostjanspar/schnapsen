import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateListener {
  private stateUpdateSubject = new Subject<any>();
  stateUpdate$ = this.stateUpdateSubject.asObservable();

  // This method would be called by the game logic to push state updates
  onStateUpdate(newState: any): void {
    console.log('State update received:', newState);
    this.stateUpdateSubject.next(newState);
  }
}
