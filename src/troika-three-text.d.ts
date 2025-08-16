declare module 'troika-three-text' {
  import { Mesh } from 'three';
  export class Text extends Mesh {
    text: string;
    fontSize: number;
    color: number | string;
    font: string;
    anchorX: string;
    anchorY: string;
    sync(): void;
    dispose(): void;
  }
}
