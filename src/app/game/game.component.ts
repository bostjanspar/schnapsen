import { Component } from '@angular/core';
import { ThreeJSComponent } from '../three-js/three-js.component';
import { UIOverlayComponent } from '../uioverlay/uioverlay.component';

@Component({
  selector: 'app-game',
  imports: [ThreeJSComponent, UIOverlayComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

}
