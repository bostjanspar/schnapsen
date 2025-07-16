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
  @ViewChild('rendererCanvas', { static: true })
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

    // Add sample player hand
    const playerHand: Card[] = [
      { suit: Suit.Hearts, rank: Rank.King, value: 4 },
      { suit: Suit.Diamonds, rank: Rank.Ten, value: 10 },
      { suit: Suit.Clubs, rank: Rank.Jack, value: 2 },
      { suit: Suit.Spades, rank: Rank.Ace, value: 11 },
      { suit: Suit.Hearts, rank: Rank.Queen, value: 3 }
    ];
    const playerHandGroup = await this.handRenderer.renderHand(playerHand);
    playerHandGroup.position.set(0, -4, 2); // Position at bottom center
    this.scene.add(playerHandGroup);

    // Add sample opponent hand
    const opponentHand: Card[] = [
      { suit: Suit.Clubs, rank: Rank.King, value: 4 },
      { suit: Suit.Spades, rank: Rank.Ten, value: 10 },
      { suit: Suit.Hearts, rank: Rank.Jack, value: 2 },
      { suit: Suit.Diamonds, rank: Rank.Ace, value: 11 },
      { suit: Suit.Clubs, rank: Rank.Queen, value: 3 }
    ];
    const opponentHandGroup = await this.handRenderer.renderHand(opponentHand, true); // Render opponent hand with question marks
    opponentHandGroup.position.set(0, 4.5, -4); // Position at top center
    opponentHandGroup.rotation.y = Math.PI; // Rotate to face away from player
    this.scene.add(opponentHandGroup);

    // Add sample talon
    const sampleTalon: Card[] = [
      { suit: Suit.Spades, rank: Rank.Queen, value: 3 },
      { suit: Suit.Hearts, rank: Rank.Ten, value: 10 },
      { suit: Suit.Clubs, rank: Rank.King, value: 4 },
      { suit: Suit.Diamonds, rank: Rank.Jack, value: 2 },
      { suit: Suit.Hearts, rank: Rank.Ace, value: 11 },
      { suit: Suit.Spades, rank: Rank.King, value: 4 },
      { suit: Suit.Clubs, rank: Rank.Ten, value: 10 },
      { suit: Suit.Diamonds, rank: Rank.Queen, value: 3 },
      { suit: Suit.Hearts, rank: Rank.Jack, value: 2 },
      { suit: Suit.Spades, rank: Rank.Ace, value: 11 }
    ];
    const sampleTrump: Card = { suit: Suit.Diamonds, rank: Rank.Ace, value: 11 };
    const talonGroup = await this.talonRenderer.renderTalon(sampleTalon, sampleTrump, false);
    talonGroup.position.set(-5, 0, 0); // Position at center-left
    this.scene.add(talonGroup);

    // Add sample trick
    const sampleTrick: Card[] = [
      { suit: Suit.Clubs, rank: Rank.King, value: 4 },
      { suit: Suit.Diamonds, rank: Rank.Jack, value: 2 }
    ];
    const trickGroup = await this.trickRenderer.renderTrick(sampleTrick);
    trickGroup.position.set(0, 0, 0); // Position at center
    this.scene.add(trickGroup);

    // Add sample player trick pile
    const playerTrickPile: Card[] = [
      { suit: Suit.Spades, rank: Rank.Ten, value: 10 },
      { suit: Suit.Hearts, rank: Rank.King, value: 4 }
    ];
    const playerTrickPileGroup = await this.trickRenderer.renderTrick(playerTrickPile, true);
    playerTrickPileGroup.position.set(5, -2, 0); // Position at bottom-right
    this.scene.add(playerTrickPileGroup);

    // Add sample opponent trick pile
    const opponentTrickPile: Card[] = [
      { suit: Suit.Diamonds, rank: Rank.Ten, value: 10 },
      { suit: Suit.Clubs, rank: Rank.King, value: 4 }
    ];
    const opponentTrickPileGroup = await this.trickRenderer.renderTrick(opponentTrickPile, true);
    opponentTrickPileGroup.position.set(5, 2, 0); // Position at top-right
    this.scene.add(opponentTrickPileGroup);

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
