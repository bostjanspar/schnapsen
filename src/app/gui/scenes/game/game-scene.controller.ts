import { ThreeService } from '../../services/three.service';
import { SchnapsenScene } from '../schnapsen-scene.enum';
import { GameScene } from './game.scene';
import { Card } from '../../../logic/schnapsen.rules';
import * as THREE from 'three';
import { CardLayout } from './cards/card-layout';

export class GameSceneController {
  constructor(private gameScene: GameScene, private threeService: ThreeService) {}

  public loadGUI(){
   
  }


  public displayHands(playerCards: Card[], opponentCards: Card[]): void {
    const playerHandPositions = CardLayout.calculateHandPositions(playerCards.length);
    playerCards.forEach((card, i) => {
      const cardMesh = this.gameScene.cardManager.createCard(card, true);
      cardMesh.position.set(playerHandPositions[i].x, playerHandPositions[i].y, playerHandPositions[i].z);
      this.gameScene.playerHandGroup.add(cardMesh);
    });

    const opponentHandPositions = CardLayout.calculateHandPositions(opponentCards.length, 0.05);
    opponentCards.forEach((card, i) => {
        const cardMesh = this.gameScene.cardManager.createCard(card, false);
        cardMesh.position.set(opponentHandPositions[i].x, opponentHandPositions[i].y + 5.5, opponentHandPositions[i].z);
        this.gameScene.opponentHandGroup.add(cardMesh);
    });
  }

  public animateDeal(): void {
    console.log('Controller: Animating deal');
    // Actual animation logic will be added here
  }

  public animateCardPlay(cardMesh: THREE.Object3D, isPlayer: boolean): void {
    console.log('Controller: Animating card play');
  }

  public showMarriageIndicator(player: 'player' | 'opponent', points: 20 | 40): void {
    console.log(`Controller: Showing marriage for ${player} with ${points} points`);
  }

  public updateScoreboard(playerScore: number, opponentScore: number): void {
    console.log(`Controller: Updating scoreboard to ${playerScore} - ${opponentScore}`);
  }

  public showWinnerBanner(winnerText: string): void {
    console.log(`Controller: Showing winner banner: ${winnerText}`);
  }

  public animateEndOfHand(): void {
    console.log('Controller: Animating end of hand');
  }
}
