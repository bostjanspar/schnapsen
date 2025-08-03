import * as THREE from 'three';
import { ThreeService } from '../services/three.service';
import { Card } from '../../logic/schnapsen.rules';
import { SchnapsenScene } from './schnapsen-scene.enum';
import { SelectDealerScene } from './select-dealer/select-dealer.scene';
import { GameScene } from './game/game.scene';

export class GuiController{

  constructor(private readonly threeService: ThreeService) {
  }

  public electNewGameDealer(dealerCard: Card | null, newDealer: number): void {
    const scene =  this.threeService.setActiveScene(SchnapsenScene.SelectDealer);
    if (!(scene instanceof SelectDealerScene)) {
       throw new Error('Active scene is not SelectDealerScene');
    }

    const selectDealerScene = scene as SelectDealerScene;
    console.log(`Electing new dealer: ${newDealer} with card ${dealerCard}`);
    selectDealerScene.initialize(dealerCard, newDealer ? true : false);
  }

  dealTheCards() {
    const scene =  this.threeService.setActiveScene(SchnapsenScene.Game);
    if (!(scene instanceof GameScene)) {
       throw new Error('Active scene is not GameScene');
    }
  }  
}