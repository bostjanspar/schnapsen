import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardClickHandler } from './card-click-handler';
import { CardHoverHandler } from './card-hover-handler';
import { CardDragHandler } from './card-drag-handler';
import { ButtonInteractionHandler } from './button-interaction-handler';

@Injectable({
  providedIn: 'root'
})
export class InputCoordinator {
  private cardClickHandler = inject(CardClickHandler);
  private cardHoverHandler = inject(CardHoverHandler);
  private cardDragHandler = inject(CardDragHandler);
  private buttonInteractionHandler = inject(ButtonInteractionHandler);

  init(canvas: HTMLCanvasElement, camera: THREE.Camera, scene: THREE.Scene): void {
    canvas.addEventListener('click', (event) => {
      const clickedObject = this.cardClickHandler.handleClick(event, camera, scene);
      if (clickedObject) {
        console.log('Clicked object:', clickedObject);
        // Further logic to handle card clicks
      }
    });

    canvas.addEventListener('mousemove', (event) => {
      const hoveredObject = this.cardHoverHandler.handleHover(event, camera, scene);
      if (hoveredObject) {
        console.log('Hovered object:', hoveredObject);
        // Further logic to handle card hovers
      }
    });

    canvas.addEventListener('mousedown', (event) => {
      this.cardDragHandler.startDrag(event, camera, scene);
    });

    canvas.addEventListener('mousemove', (event) => {
      this.cardDragHandler.drag(event, camera);
    });

    canvas.addEventListener('mouseup', () => {
      this.cardDragHandler.endDrag();
    });

    // Example for button interaction (assuming buttons are part of UIOverlayComponent)
    this.buttonInteractionHandler.buttonClick$.subscribe((buttonId) => {
      console.log(`InputCoordinator received button click: ${buttonId}`);
      // Handle button clicks based on ID
    });
  }
}
