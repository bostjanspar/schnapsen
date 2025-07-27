import { ThreeSceneComponent } from './gui/three-scene/three-scene';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [ThreeSceneComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'schnapsen';
}
