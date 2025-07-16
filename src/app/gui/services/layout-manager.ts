import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class LayoutManager {
  private positions = {
    playerHand: new THREE.Vector3(0, 0.1, 4),
    opponentHand: new THREE.Vector3(0, 0.1, -4),
    talon: new THREE.Vector3(-7, 0.1, 0),
    trickArea: new THREE.Vector3(0, 0.1, 0),
    playerTricks: new THREE.Vector3(7, 0.1, 4),
    opponentTricks: new THREE.Vector3(7, 0.1, -4)
  };

  getPlayerHandPosition(): THREE.Vector3 {
    return this.positions.playerHand;
  }

  getOpponentHandPosition(): THREE.Vector3 {
    return this.positions.opponentHand;
  }

  getTalonPosition(): THREE.Vector3 {
    return this.positions.talon;
  }

  getTrickAreaPosition(): THREE.Vector3 {
    return this.positions.trickArea;
  }

  getPlayerTricksPosition(): THREE.Vector3 {
    return this.positions.playerTricks;
  }

  getOpponentTricksPosition(): THREE.Vector3 {
    return this.positions.opponentTricks;
  }
}
