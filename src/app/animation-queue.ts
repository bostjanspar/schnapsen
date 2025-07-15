import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationQueue {
  private queue: (() => Promise<void>)[] = [];
  private isProcessing = false;

  add(animationFn: () => Promise<void>): void {
    this.queue.push(animationFn);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const animationFn = this.queue.shift();
      if (animationFn) {
        await animationFn();
      }
    }
    this.isProcessing = false;
  }
}
