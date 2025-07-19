import * as THREE from 'three';

export class TextureUtils {
  static createTextTexture(text: string, options: any): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const {
      width = 256,
      height = 128,
      font = '48px Arial',
      fillStyle = 'white',
      textAlign = 'center',
      textBaseline = 'middle',
      backgroundColor = 'transparent',
    } = options;

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;

    if (backgroundColor !== 'transparent') {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.font = font;
    context.fillStyle = fillStyle;
    context.textAlign = textAlign as CanvasTextAlign;
    context.textBaseline = textBaseline as CanvasTextBaseline;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  static createGradientTexture(colors: string[], direction: string): THREE.CanvasTexture {
    // Implementation will go here
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  static createPatternTexture(pattern: any, size: number): THREE.CanvasTexture {
    // Implementation will go here
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  static createCardBackTexture(design: string, colors: string[]): THREE.CanvasTexture {
    // Implementation will go here
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }
}
