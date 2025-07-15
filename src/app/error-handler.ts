import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {
  handleError(error: any): void {
    console.error('An error occurred:', error);
    // Implement more sophisticated error handling here, e.g., displaying a user-friendly message,
    // logging to a remote service, or triggering a state change.
  }
}
