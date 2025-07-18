import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SchnapsenScene } from '../scenes/schnapsen-scene.enum';
import { StartupScene } from '../scenes/startup.scene';
import { GameScene } from '../scenes/game.scene';
import { BaseScene } from '../scenes/base.scene';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private scenes: Map<SchnapsenScene, BaseScene> = new Map();
  private activeScene!: BaseScene;

  constructor() { }

  public async init(container: HTMLElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    const width = Math.max(window.innerWidth, 600);
    const height = Math.max(window.innerHeight, 600);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Scenes
    const gameScene = new GameScene();
    await gameScene.initialize();

    this.scenes.set(SchnapsenScene.Startup, new StartupScene(() => this.setActiveScene(SchnapsenScene.Game)));
    this.scenes.set(SchnapsenScene.Game, gameScene);
    this.scenes.forEach(scene => scene.camera = this.camera);

    this.setupLighting();

    this.setActiveScene(SchnapsenScene.Startup);

    this.animate();

    window.addEventListener('resize', this.onResize);
  }

  public setActiveScene(scene: SchnapsenScene) {
    this.activeScene = this.scenes.get(scene)!;
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);

    this.scenes.forEach(scene => {
      scene.add(ambientLight.clone());
      scene.add(directionalLight.clone());
    });
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    this.activeScene.update();

    this.renderer.render(this.activeScene, this.camera);
  }

  private onResize = () => {
    const width = Math.max(window.innerWidth, 600);
    const height = Math.max(window.innerHeight, 600);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public handleInteraction(event: MouseEvent) {
    if (!this.activeScene.allowMouseEvent) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.activeScene.onMouseEvent(mouse);
  }
}
