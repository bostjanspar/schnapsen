import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionValidationHandler {
  // Placeholder for action validation logic
  isValidAction(action: string, currentState: any): boolean {
    console.log(`Validating action: ${action} in state: ${currentState}`);
    // Implement actual validation logic based on game rules and current state
    return true; 
  }

  getValidationFeedback(action: string, currentState: any): string | null {
    if (!this.isValidAction(action, currentState)) {
      return `Action '${action}' is not valid in the current state.`;
    }
    return null;
  }
}
