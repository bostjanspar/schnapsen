import { Injectable, inject } from '@angular/core';
import { StateListener } from './state-listener';
import { AnimationService } from './animation.service';

@Injectable({
  providedIn: 'root'
})
export class StateProcessor {
  private stateListener = inject(StateListener);
  private animationService = inject(AnimationService);

  constructor() {
    this.stateListener.stateUpdate$.subscribe(newState => {
      this.processStateChange(newState);
    });
  }

  private processStateChange(newState: any): void {
    console.log('Processing state change:', newState);
    // Here you would implement logic to update GUI components and trigger animations
    // based on the newState. For example:

    // if (newState.phase === 'dealing') {
    //   this.animationService.dealCard(...);
    // }
  }
}
