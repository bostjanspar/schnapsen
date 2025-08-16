import * as THREE from 'three';
import { BaseScene } from '../base.scene';
import { UIUtils } from '../../utils/ui.utils';
import { Subject, Subscription } from 'rxjs';
import { EventEnum, SimpleEvent } from '../../../events/event.enum';
import { TextService } from '../../services/text.service';
import { TranslateService } from '@ngx-translate/core';
import { Text } from 'troika-three-text';

export class StartupScene extends BaseScene {
  private raycaster = new THREE.Raycaster();
  private langChangeSubscription: Subscription;

  constructor(
    private readonly eventPush: Subject<SimpleEvent>,
    protected override readonly camera: THREE.Camera,
    private readonly textService: TextService,
    private readonly translate: TranslateService
  ) {
    super(camera);
    this.background = new THREE.Color(0xcccccc);

    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.createButtons();

    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.resetScene();
    });
  }

  private createButtons(): void {
    const startButton = UIUtils.createButtonPlane({ width: 2, height: 0.5 }, { backgroundColor: '#007bff' });
    startButton.name = 'startButton';
    this.add(startButton);

    this.translate.get('startGame').subscribe((text: string) => {
      const textMesh = this.textService.createText(text, 0.5, 0xffffff);
      textMesh.position.z = 0.01;
      startButton.add(textMesh);
    });

    const langButton = UIUtils.createButtonPlane({ width: 1, height: 0.3 }, { backgroundColor: '#6c757d' });
    langButton.name = 'langButton';
    langButton.position.y = -0.7;
    this.add(langButton);

    const langTextKey = this.translate.currentLang === 'en' ? 'Deutsch' : 'English';
    const langTextMesh = this.textService.createText(langTextKey, 0.3, 0xffffff);
    langTextMesh.position.z = 0.01;
    langButton.add(langTextMesh);
  }

  private resetScene(): void {
    this.children.forEach(child => {
      if (child.children.length > 0) {
        const textChild = child.children[0];
        if (textChild instanceof Text) {
          (textChild as Text).dispose();
        }
      }
    });
    
    while (this.children.length > 0) {
      this.remove(this.children[0]);
    }
    this.createButtons();
  }

  public onMouseEvent(mouse: THREE.Vector2): void {
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.children, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const parentName = intersectedObject.parent?.name;
      
      if (parentName === 'startButton' || intersectedObject.name === 'startButton') {
        this.eventPush.next(new SimpleEvent(EventEnum.START_GAME));
      } else if (parentName === 'langButton' || intersectedObject.name === 'langButton') {
        const newLang = this.translate.currentLang === 'en' ? 'de' : 'en';
        this.translate.use(newLang);
      }
    }
  }

  public update(): void {
    // No animation in the startup scene
  }

  public onMouseMove(mouse: THREE.Vector2): void {
    // No mouse move interaction in the startup scene
  }

  public override dispose(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    super.dispose();
  }
}
