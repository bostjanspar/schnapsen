import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import * as THREE from 'three';
import { SceneManager } from '../services/scene-manager';
import { CameraController } from '../services/camera-controller';
import { LightingSetup } from '../services/lighting-setup';
import { TableRenderer } from '../services/table-renderer';
import { BackgroundRenderer } from '../services/background-renderer';
import { LayoutManager } from '../services/layout-manager';
import { CardRenderer } from '../services/card-renderer';
import { HandRenderer } from '../services/hand-renderer';
import { TalonRenderer } from '../services/talon-renderer';
import { TrickRenderer } from '../services/trick-renderer';
import { AnimationService } from '../services/animation.service';
import { InputCoordinator } from '../services/input-coordinator';
import { Card } from '../../logic/models/card.model';
import { Rank } from '../../logic/models/rank.enum';
import { Suit } from '../../logic/models/suit.enum';

@Component({
  selector: 'app-three-js',
  imports: [],
  templateUrl: './three-js.component.html',
  styleUrl: './three-js.component.css'
})
export class ThreeJSComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas')
  private rendererCanvas!: ElementRef<HTMLCanvasElement>;

  private sceneManager = inject(SceneManager);
  private cameraController = inject(CameraController);
  private lightingSetup = inject(LightingSetup);
  private tableRenderer = inject(TableRenderer);
  private backgroundRenderer = inject(BackgroundRenderer);
  private layoutManager = inject(LayoutManager);
  private cardRenderer = inject(CardRenderer);
  private handRenderer = inject(HandRenderer);
  private talonRenderer = inject(TalonRenderer);
  private trickRenderer = inject(TrickRenderer);
  private animationService = inject(AnimationService);
  private inputCoordinator = inject(InputCoordinator);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  async ngAfterViewInit(): Promise<void> {
    this.scene = this.sceneManager.initScene();
    this.renderer = this.sceneManager.initRenderer(this.rendererCanvas.nativeElement);
    this.camera = this.cameraController.initCamera(this.rendererCanvas.nativeElement.clientWidth, this.rendererCanvas.nativeElement.clientHeight);
    this.lightingSetup.setupLights(this.scene);

    // Add table and background to the scene
    this.scene.add(this.tableRenderer.createTable());
    this.scene.add(this.backgroundRenderer.createBackground());

    // Add a sample card
    const sampleCard: Card = { suit: Suit.Spades, rank: Rank.Ace, value: 11 };
    const cardMesh = await this.cardRenderer.renderCard(sampleCard);
    cardMesh.position.set(0, 0, 0);
    this.scene.add(cardMesh);

    // Add sample hand
    const sampleHand: Card[] = [
      { suit: Suit.Hearts, rank: Rank.King, value: 4 },
      { suit: Suit.Diamonds, rank: Rank.Ten, value: 10 },
      { suit: Suit.Clubs, rank: Rank.Jack, value: 2 }
    ];
    const handGroup = await this.handRenderer.renderHand(sampleHand);
    handGroup.position.set(-1, -2, 0);
    this.scene.add(handGroup);

    // Add sample talon
    const sampleTalon: Card[] = [
      { suit: Suit.Spades, rank: Rank.Queen, value: 3 },
      { suit: Suit.Hearts, rank: Rank.Ten, value: 10 }
    ];
    const sampleTrump: Card = { suit: Suit.Diamonds, rank: Rank.Ace, value: 11 };
    const talonGroup = await this.talonRenderer.renderTalon(sampleTalon, sampleTrump, false);
    talonGroup.position.set(2, 0, 0);
    this.scene.add(talonGroup);

    // Add sample trick
    const sampleTrick: Card[] = [
      { suit: Suit.Clubs, rank: Rank.King, value: 4 },
      { suit: Suit.Diamonds, rank: Rank.Jack, value: 2 }
    ];
    const trickGroup = await this.trickRenderer.renderTrick(sampleTrick);
    trickGroup.position.set(0, 1, 0);
    this.scene.add(trickGroup);

    this.inputCoordinator.init(this.rendererCanvas.nativeElement, this.camera, this.scene);

    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  ngOnDestroy(): void {
    this.renderer.dispose();
    window.removeEventListener('resize', () => this.onWindowResize());
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.cameraController.onWindowResize(this.camera, this.renderer, this.rendererCanvas.nativeElement.clientWidth, this.rendererCanvas.nativeElement.clientHeight);
  }
}
