import { Component } from '@angular/core';
import { ScoreComponent } from '../score/score.component';
import { TrickAreaComponent } from '../trick-area/trick-area.component';
import { PlayerHandComponent } from '../player-hand/player-hand.component';
import { TalonComponent } from '../talon/talon.component';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { CardValuesBoxComponent } from '../card-values-box/card-values-box.component';

@Component({
  selector: 'app-uioverlay',
  imports: [ScoreComponent, TrickAreaComponent, PlayerHandComponent, TalonComponent, ActionButtonsComponent, CardValuesBoxComponent],
  templateUrl: './uioverlay.component.html',
  styleUrl: './uioverlay.component.css'
})
export class UIOverlayComponent {

}