import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-talon',
  imports: [],
  templateUrl: './talon.component.html',
  styleUrl: './talon.component.css'
})
export class TalonComponent {
  @Input() cardsLeft: number = 7;
}