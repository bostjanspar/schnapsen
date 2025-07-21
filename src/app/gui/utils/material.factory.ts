import * as THREE from 'three';
import { Suit, Rank } from '../schnapsen.rules';
import { TextureUtils } from './texture.utils';

export class MaterialFactory {
  private static materialCache: Map<string, THREE.Material> = new Map();

  static getCardMaterial(cardId: string, faceUp: boolean): THREE.Material {

    const cacheKey = faceUp ? `${cardId}` : `back`;
    if (this.materialCache.has(cacheKey)) {
      return this.materialCache.get(cacheKey)!;
    }
    // Implementation will go here
    const material = new THREE.MeshBasicMaterial();
    this.materialCache.set(cacheKey, material);
    return material;
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
    const textureLoader = new THREE.TextureLoader();
    const promises = [];

    // Preload card back
    const cardBackMaterial = new THREE.MeshLambertMaterial({
      map: TextureUtils.createCardBackTexture('default', []),
    });
    this.materialCache.set('back', cardBackMaterial);

    // Preload card faces
    for (const suit of Object.values(Suit)) {
      for (const rank of Object.values(Rank)) {
        const cardId = `${suit}_${rank}`;
        const path = `/assets/cards/${suit}_${rank}.svg`;
        const promise = new Promise<void>((resolve) => {
          textureLoader.load(path, (texture) => {
            const material = new THREE.MeshLambertMaterial({ map: texture });
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
