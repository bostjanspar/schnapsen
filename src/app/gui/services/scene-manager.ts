import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneManager {
  initScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    return scene;
  }

  initRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
  }
}
