import * as THREE from 'three';
import { TextureUtils } from './texture.utils';

export class UIUtils {
  static createButton(text: string, size: any, style: any): THREE.Mesh {
    const texture = TextureUtils.createTextTexture(text, style);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(size.width, size.height);
    const button = new THREE.Mesh(geometry, material);
    return button;
  }

  static createLabel(text: string, position: any, style: any): THREE.Mesh {
    const texture = TextureUtils.createTextTexture(text, style);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(1, 0.5);
    const label = new THREE.Mesh(geometry, material);
    label.position.set(position.x, position.y, position.z);
    return label;
  }

  static createScoreDisplay(score: number, position: any): THREE.Mesh {
    // Implementation will go here
    return new THREE.Mesh();
  }

  static createGameStatus(message: string, type: string): THREE.Mesh {
    // Implementation will go here
    return new THREE.Mesh();
  }

  static createTooltip(text: string, targetObject: THREE.Object3D): THREE.Mesh {
    // Implementation will go here
    return new THREE.Mesh();
  }
}
