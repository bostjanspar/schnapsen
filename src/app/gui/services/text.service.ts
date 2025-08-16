
import { Injectable } from '@angular/core';
import { Text } from 'troika-three-text';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  constructor() {}

  public createText(text: string, fontSize: number, color: number) {
    const textMesh = new Text();
    textMesh.text = text;
    textMesh.fontSize = fontSize;
    textMesh.color = color;
    textMesh.font = 'assets/fonts/ModernGermanHandwriting.ttf';
    textMesh.anchorX = 'center';
    textMesh.anchorY = 'middle';
    textMesh.sync();
    return textMesh;
  }
}
