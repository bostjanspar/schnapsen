import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [NgFor],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css'
})
export class ActionButtonsComponent {
  @Input() availableActions: string[] = [];
  @Output() actionSelected = new EventEmitter<string>();

  onActionClick(action: string): void {
    this.actionSelected.emit(action);
  }
}