import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Suit } from '../../logic/models/suit.enum';
import { Rank } from '../../logic/models/rank.enum';

@Injectable({
  providedIn: 'root'
})
export class CardMaterialManager {
  private materialCache: Map<string, THREE.Material[]> = new Map();
  private textureLoader = new THREE.TextureLoader();
  private cardBackMaterial: THREE.Material[] | null = null;

  constructor() {
    this.preloadCardBack();
  }

  private async preloadCardBack(): Promise<void> {
    const backTexture = await this.textureLoader.loadAsync('assets/card_back.png');
    this.cardBackMaterial = [
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ color: 'white' }),
      new THREE.MeshStandardMaterial({ map: backTexture }),
      new THREE.MeshStandardMaterial({ color: 'white' })
    ];
  }

  async getCardMaterial(suit: Suit, rank: Rank): Promise<THREE.Material[]> {
    const key = `${suit}_${rank}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key)!;
    }

    const texturePath = `assets/${rank}_of_${suit}.svg`;
    const texture = await this.textureLoader.loadAsync(texturePath);
    const material = new THREE.MeshStandardMaterial({ map: texture });

    const materials = [
      new THREE.MeshStandardMaterial({ color: 'white' }), // right
      new THREE.MeshStandardMaterial({ color: 'white' }), // left
      new THREE.MeshStandardMaterial({ color: 'white' }), // top
      new THREE.MeshStandardMaterial({ color: 'white' }), // bottom
      this.cardBackMaterial ? this.cardBackMaterial[4] : new THREE.MeshStandardMaterial({ color: 'grey' }), // back
      material // front
    ];

    this.materialCache.set(key, materials);
    return materials;
  }

  getCardBackMaterial(): THREE.Material[] {
    if (!this.cardBackMaterial) {
      throw new Error('Card back material not preloaded');
    }
    return this.cardBackMaterial;
  }
}
