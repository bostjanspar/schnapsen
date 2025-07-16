import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonInteractionHandler {
  private buttonClickSubject = new Subject<string>();
  buttonClick$ = this.buttonClickSubject.asObservable();

  handleButtonClick(buttonId: string): void {
    console.log(`Button ${buttonId} clicked.`);
    this.buttonClickSubject.next(buttonId);
  }
}
