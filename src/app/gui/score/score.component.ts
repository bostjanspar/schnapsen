import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score',
  imports: [],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css'
})
export class ScoreComponent {
  @Input() playerScore: number = 0;
  @Input() opponentScore: number = 0;
  @Input() phase: string = 'Talon Phase';
  @Input() gamePointsPlayer: number = 7;
  @Input() gamePointsOpponent: number = 7;
  @Input() trickLeader: string = 'Player';
  @Input() opponentCardPoints: number = 25;
}