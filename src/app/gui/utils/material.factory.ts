import * as THREE from 'three';
import { GameConstants } from '../../logic/game.constants';
import { Suit, Rank } from '../../logic/schnapsen.rules';
import { TextureUtils } from './texture.utils';

export class MaterialFactory {
  private static materialCache: Map<string, THREE.Material> = new Map();

  static getCardMaterial(cardId: string, faceUp: boolean): THREE.Material[] {
    const faceMaterial = this.materialCache.get(cardId)!;
    const backMaterial = this.materialCache.get('back')!;
    const sideMaterial = this.materialCache.get('side')!;

    const front = faceUp ? faceMaterial : backMaterial;
    const back = faceUp ? backMaterial : faceMaterial;

    return [
      sideMaterial, // right
      sideMaterial, // left
      sideMaterial, // top
      sideMaterial, // bottom
      front,        // front
      back,         // back
    ];
  }

  static getUIMaterial(type: string, style: any): THREE.Material {
    const cacheKey = `${type}-${JSON.stringify(style)}`;
    if (this.materialCache.has(cacheKey)) {
      return this.materialCache.get(cacheKey)!;
    }
    // Implementation will go here
    const material = new THREE.MeshBasicMaterial();
    this.materialCache.set(cacheKey, material);
    return material;
  }

  static async preloadAllMaterials(): Promise<void> {
    if (this.materialCache.size > 0) {
      return; // Materials already preloaded
    }

    const textureLoader = new THREE.TextureLoader();
    const promises = [];

    // Preload card back
    const cardBackTexture = TextureUtils.createCardBackTexture('default', []);
    const cardBackMaterial = new THREE.MeshLambertMaterial({
            map: cardBackTexture,
      transparent: true,
    });
    this.materialCache.set('back', cardBackMaterial);

    const sideMaterial = new THREE.MeshBasicMaterial({ color: GameConstants.TABLE_COLOR });
    this.materialCache.set('side', sideMaterial);

    // Preload card faces
    for (const suit of Object.values(Suit)) {
      for (const rank of Object.values(Rank)) {
        const cardId = `${suit}_${rank}`;
        const path = `/assets/cards/${suit}_${rank}.svg`;
        const promise = new Promise<void>((resolve) => {
          textureLoader.load(path, (texture) => {
            const material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
            this.materialCache.set(`${cardId}`, material);
            resolve();
          });
        });
        promises.push(promise);
      }
    }

    await Promise.all(promises);
  }

  static disposeMaterials(): void {
    this.materialCache.forEach(material => material.dispose());
    this.materialCache.clear();
  }
}
