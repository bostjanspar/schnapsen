import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardMaterialManager } from './card-material-manager';
import { Suit } from '../../logic/models/suit.enum';
import { Rank } from '../../logic/models/rank.enum';

@Injectable({
  providedIn: 'root'
})
export class CardMeshFactory {
  private cardMaterialManager = inject(CardMaterialManager);

  async createCardMesh(suit: Suit, rank: Rank): Promise<THREE.Mesh> {
    const materials = await this.cardMaterialManager.getCardMaterial(suit, rank);
    const geometry = new THREE.BoxGeometry(2, 2.8, 0.05); // Adjusted card dimensions for a more standard aspect ratio
    const card = new THREE.Mesh(geometry, materials);
    return card;
  }

  createCardBackMesh(): THREE.Mesh {
    const materials = this.cardMaterialManager.getCardBackMaterial();
    const geometry = new THREE.BoxGeometry(2, 2.8, 0.05); // Adjusted card dimensions for a more standard aspect ratio
    const card = new THREE.Mesh(geometry, materials);
    return card;
  }

  async createQuestionMarkCardMesh(): Promise<THREE.Mesh> {
    const materials = await this.cardMaterialManager.getQuestionMarkMaterial();
    const geometry = new THREE.BoxGeometry(2, 2.8, 0.05); // Adjusted card dimensions for a more standard aspect ratio
    const card = new THREE.Mesh(geometry, materials);
    return card;
  }
}
