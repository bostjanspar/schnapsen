import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-scene',
  template: '<div #threeContainer class="three-fullscreen" style="position:fixed;top:0;left:0;width:100vw;height:100vh;overflow:hidden;"></div>',
  standalone: true,
  styleUrls: ['three-scene.css']
})
export class ThreeSceneComponent implements OnInit, OnDestroy {
  @ViewChild('threeContainer', { static: true }) containerRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private resizeObserver!: ResizeObserver;

  ngOnInit() {
    this.initThree();
    this.animate();

    // Listen for container resize to update renderer/camera
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.containerRef.nativeElement);
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.onResize);
  }

  private initThree() {
    const container = this.containerRef.nativeElement;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Create a simple cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Position camera
    this.camera.position.z = 5;
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate the cube
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  private onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
}