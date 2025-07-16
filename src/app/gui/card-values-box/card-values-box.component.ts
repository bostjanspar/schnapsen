import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-card-values-box',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './card-values-box.component.html',
  styleUrl: './card-values-box.component.css'
})
export class CardValuesBoxComponent {
  cardValues = [
    { name: 'Ace (A)', value: 11 },
    { name: 'Ten (10)', value: 10 },
    { name: 'King (K)', value: 4 },
    { name: 'Queen (Q)', value: 3 },
    { name: 'Jack (J)', value: 2 }
  ];

  marriageValues = [
    { name: 'Royal Marriage', value: 40 },
    { name: 'Plain Marriage', value: 20 }
  ];
}