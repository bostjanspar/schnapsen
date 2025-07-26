import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomService {

  constructor() { }

  public getRandomNumber(max: number): number {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return randomValues[0] % max;
  }

}
