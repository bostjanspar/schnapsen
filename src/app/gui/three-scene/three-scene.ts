import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ThreeService } from '../services/three.service';

@Component({
  selector: 'app-three-scene',
  template: '<div #threeContainer style="width: 100%; height: 100vh; overflow: hidden;"></div>',
  standalone: true,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 1;
    }
    .three-fullscreen {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
  `]
})
export class ThreeSceneComponent implements OnInit {
  @ViewChild('threeContainer', { static: true }) containerRef!: ElementRef;

  constructor(private threeService: ThreeService) {}

  ngOnInit() {
    this.threeService.init(this.containerRef.nativeElement);
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) {
    this.threeService.handleInteraction(event);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.threeService.handleMouseMove(event);
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    // Interpret the first touch as a mouse click
    if (event.touches.length > 0) {
      // Create a synthetic MouseEvent using the first touch point
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent('click', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        screenX: touch.screenX,
        screenY: touch.screenY,
        bubbles: true,
        cancelable: true,
        view: window
      });
      this.threeService.handleInteraction(mouseEvent);
    }
  }
}
