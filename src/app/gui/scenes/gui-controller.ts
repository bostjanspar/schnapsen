import * as THREE from 'three';
import { ThreeService } from '../services/three.service';
import { Card } from '../../logic/schnapsen.rules';

export class GuiController{  
  constructor(private readonly threeService: ThreeService) {
  }

  public electNewGameDealer(dealerCard: Card, newDealer: number): void {
    console.log(`Electing new dealer: ${newDealer} with card ${dealerCard}`);
  }

  public showNewGameDealer(dealer: number): void {
    console.log(`New game dealer is: ${dealer}`);
  }

}