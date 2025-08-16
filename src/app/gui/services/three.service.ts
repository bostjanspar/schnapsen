import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SchnapsenScene } from '../scenes/schnapsen-scene.enum';
import { StartupScene } from '../scenes/startup/startup.scene';
import { SelectDealerScene } from '../scenes/select-dealer/select-dealer.scene';
import { GameScene } from '../scenes/game/game.scene';
import { BaseScene } from '../scenes/base.scene';
import { GameStateMachine } from '../../sm/game/game-state-machine';
import { RandomService } from '../../logic/random.service';
import { GameLogic } from '../../logic/game-logic';
import { GuiController } from '../scenes/gui-controller';
import { Subject } from 'rxjs';
import { SimpleEvent } from '../../events/event.enum';

import { TextService } from './text.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {

  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private activeScene!: BaseScene;
  private gameLogic!: GameLogic;

  private eventSubject = new Subject<SimpleEvent>();
  
  private isPageVisible: boolean = true;
  private targetFrameRate: number = 60;
  private lastFrameTime: number = 0;

  constructor(
    private readonly randomService: RandomService,
    private readonly textService: TextService,
    private readonly translate: TranslateService
  ) { 
    this.gameLogic = new GameLogic(this.randomService);
  }

  public async init(container: HTMLElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable antialiasing for better performance
      powerPreference: "high-performance" // Optimize for performance
    });
    const width = Math.max(window.innerWidth, 600);
    const height = Math.max(window.innerHeight, 600);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to reduce GPU load
    container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

   

    this.setActiveScene(SchnapsenScene.Startup);
    
    // Add visibility change listener for performance optimization
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('resize', this.onResize);

   
    const sm = new GameStateMachine(
      this.gameLogic,
      new GuiController(this)      
    );

    this.eventSubject.subscribe(event => {
      sm.onEvent(event);
    });
    
    // Start animation loop
    this.animate();
   
  }

  public setActiveScene(scene: SchnapsenScene): BaseScene  {
    const newScene = this.buildScenes(scene);
    this.setupLighting(newScene);

    this.activeScene = newScene
    return newScene;    
  }

  private buildScenes(sceneEnum: SchnapsenScene) : BaseScene {
    switch (sceneEnum) {
      case SchnapsenScene.Startup:
        return new StartupScene(this.eventSubject, this.camera, this.textService, this.translate);
      case SchnapsenScene.SelectDealer:
        return new SelectDealerScene(this.eventSubject, this.camera);
      case SchnapsenScene.Game:{
         // Scenes
        const gameScene = new GameScene(this.camera, this.gameLogic);
        gameScene.initialize(this);
        return gameScene;
      }
      default:
        throw new Error(`Scene ${sceneEnum} not implemented`);  
    }
  }

  private setupLighting(scene: BaseScene ) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);

    scene.add(ambientLight.clone());
    scene.add(directionalLight.clone());
  
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    // Only render if it's time for a new frame
    if (this.shouldRenderFrame()) {
      this.activeScene.update();
      this.renderer.render(this.activeScene, this.camera);
    }
  }

  private onResize = () => {
    const width = Math.max(window.innerWidth, 600);
    const height = Math.max(window.innerHeight, 600);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onVisibilityChange = () => {
    this.isPageVisible = !document.hidden;
    // Reduce frame rate when tab is not visible
    this.targetFrameRate = this.isPageVisible ? 60 : 15;
  }

  private shouldRenderFrame(): boolean {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    const minFrameTime = 1000 / this.targetFrameRate;
    
    if (deltaTime >= minFrameTime) {
      this.lastFrameTime = now - (deltaTime % minFrameTime);
      return true;
    }
    return false;
  }

  public handleInteraction(event: MouseEvent) {

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.activeScene.onMouseEvent(mouse);
  }

  public handleMouseMove(event: MouseEvent) {
    if (!this.activeScene) return;


    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.activeScene.onMouseMove(mouse);
  }
}
