import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private startupScene!: THREE.Scene;
  private gameScene!: THREE.Scene;

  constructor() { }

  public init(container: HTMLElement) {
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

    this.createStartupScene();
    this.createGameScene();

    // Start with the startup scene
    this.scene = this.startupScene;

    this.animate();

    window.addEventListener('resize', this.onResize);
  }

  private createStartupScene() {
    this.startupScene = new THREE.Scene();
    // Add a button or other elements for the startup screen
    // For now, just a different color background
    this.startupScene.background = new THREE.Color(0xcccccc);

    const geometry = new THREE.BoxGeometry(2, 0.5, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x007bff });
    const button = new THREE.Mesh(geometry, material);
    button.name = 'startButton';
    this.startupScene.add(button);
  }

  private createGameScene() {
    this.gameScene = new THREE.Scene();
    this.gameScene.background = new THREE.Color(0x000000);
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // Move the cube to the top right of the visible area
    // Assuming camera is at z=5, looking at origin, and default FOV
    // Move cube to (x: right, y: top)
    cube.position.x = -3; // adjust as needed
    cube.position.y = 2; // adjust as needed

    this.gameScene.add(cube);
  }

  public startGame() {
    this.scene = this.gameScene;
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    if (this.scene === this.gameScene) {
        const cube = this.gameScene.children[0] as THREE.Mesh;
        if(cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onResize = () => {
    const width = Math.max(window.innerWidth, 600);
    const height = Math.max(window.innerHeight, 600);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public handleInteraction(event: MouseEvent) {
    if (this.scene !== this.startupScene) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.startupScene.children);

    if (intersects.length > 0 && intersects[0].object.name === 'startButton') {
      this.startGame();
    }
  }
}
