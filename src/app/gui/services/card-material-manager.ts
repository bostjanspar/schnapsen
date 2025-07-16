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
    try {
      const backTexture = await this.textureLoader.loadAsync('assets/card_back.png');
      this.cardBackMaterial = [
        new THREE.MeshStandardMaterial({ color: 'white' }),
        new THREE.MeshStandardMaterial({ color: 'white' }),
        new THREE.MeshStandardMaterial({ color: 'white' }),
        new THREE.MeshStandardMaterial({ color: 'white' }),
        new THREE.MeshStandardMaterial({ map: backTexture }),
        new THREE.MeshStandardMaterial({ color: 'white' })
      ];
    } catch (error) {
      console.error('Failed to load card back texture:', error);
      // Use a fallback material
      this.cardBackMaterial = [
        new THREE.MeshStandardMaterial({ color: 'grey' }),
        new THREE.MeshStandardMaterial({ color: 'grey' }),
        new THREE.MeshStandardMaterial({ color: 'grey' }),
        new THREE.MeshStandardMaterial({ color: 'grey' }),
        new THREE.MeshStandardMaterial({ color: 'darkgrey' }),
        new THREE.MeshStandardMaterial({ color: 'grey' })
      ];
    }
  }

  async getCardMaterial(suit: Suit, rank: Rank): Promise<THREE.Material[]> {
    const key = `${suit}_${rank}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key)!;
    }

    try {
      const texture = await this.loadSvgAsTexture(suit, rank);
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
    } catch (error) {
      console.error(`Failed to load texture for ${rank} of ${suit}:`, error);
      // Return a fallback material
      return [
        new THREE.MeshStandardMaterial({ color: 'red' }),
        new THREE.MeshStandardMaterial({ color: 'red' }),
        new THREE.MeshStandardMaterial({ color: 'red' }),
        new THREE.MeshStandardMaterial({ color: 'red' }),
        new THREE.MeshStandardMaterial({ color: 'darkred' }),
        new THREE.MeshStandardMaterial({ color: 'red' })
      ];
    }
  }

  getCardBackMaterial(): THREE.Material[] {
    if (!this.cardBackMaterial) {
      throw new Error('Card back material not preloaded');
    }
    return this.cardBackMaterial;
  }

  private questionMarkMaterial: THREE.Material[] | null = null;

  async getQuestionMarkMaterial(): Promise<THREE.Material[]> {
    if (this.questionMarkMaterial) {
      return this.questionMarkMaterial;
    }
    try {
      const texture = await this.textureLoader.loadAsync('assets/question_mark_card.svg');
      const material = new THREE.MeshStandardMaterial({ map: texture });
      this.questionMarkMaterial = [
        new THREE.MeshStandardMaterial({ color: 'white' }), // right
        new THREE.MeshStandardMaterial({ color: 'white' }), // left
        new THREE.MeshStandardMaterial({ color: 'white' }), // top
        new THREE.MeshStandardMaterial({ color: 'white' }), // bottom
        this.cardBackMaterial ? this.cardBackMaterial[4] : new THREE.MeshStandardMaterial({ color: 'grey' }), // back
        material // front
      ];
      return this.questionMarkMaterial;
    } catch (error) {
      console.error('Failed to load question mark card texture:', error);
      return [
        new THREE.MeshStandardMaterial({ color: 'purple' }),
        new THREE.MeshStandardMaterial({ color: 'purple' }),
        new THREE.MeshStandardMaterial({ color: 'purple' }),
        new THREE.MeshStandardMaterial({ color: 'purple' }),
        new THREE.MeshStandardMaterial({ color: 'darkpurple' }),
        new THREE.MeshStandardMaterial({ color: 'purple' })
      ];
    }
  }

  private async loadSvgAsTexture(suit: Suit, rank: Rank): Promise<THREE.Texture> {
    const texturePath = `assets/${rank}_of_${suit}.svg`;
    const response = await fetch(texturePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }
    const svgText = await response.text();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, (texture) => {
        URL.revokeObjectURL(url);
        resolve(texture);
      }, undefined, (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      });
    });
  }
}
