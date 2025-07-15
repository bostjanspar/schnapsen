import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationCallbackManager {
  private animationCompleteSubject = new Subject<string>();
  animationComplete$ = this.animationCompleteSubject.asObservable();

  animationCompleted(animationId: string): void {
    console.log(`Animation ${animationId} completed.`);
    this.animationCompleteSubject.next(animationId);
  }
}
