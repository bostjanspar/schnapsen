import { Injectable, inject } from '@angular/core';
import { AnimationQueue } from './animation-queue';
import { TweenService } from './tween-service';

@Injectable({
  providedIn: 'root'
})
export class AnimationManager {
  private animationQueue = inject(AnimationQueue);
  private tweenService = inject(TweenService);

  addAnimation(animationFn: () => Promise<void>): void {
    this.animationQueue.add(animationFn);
  }

  // Helper for simple tweens
  createTween(target: any, vars: gsap.TweenVars): Promise<void> {
    return new Promise(resolve => {
      this.tweenService.to(target, { ...vars, onComplete: resolve });
    });
  }
}
