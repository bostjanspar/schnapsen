import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationRequestHandler {
  private animationRequestSubject = new Subject<any>();
  animationRequest$ = this.animationRequestSubject.asObservable();

  requestAnimation(animationType: string, payload?: any): void {
    console.log(`Animation request: ${animationType}`, payload);
    this.animationRequestSubject.next({ type: animationType, payload });
  }
}
