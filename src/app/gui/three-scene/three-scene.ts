import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ThreeService } from '../services/three.service';

@Component({
  selector: 'app-three-scene',
  template: '<div #threeContainer style="width: 100%; height: 100vh; overflow: hidden;"></div>',
  standalone: true,
  styleUrls: ['three-scene.css']
})
export class ThreeSceneComponent implements OnInit {
  @ViewChild('threeContainer', { static: true }) containerRef!: ElementRef;

  constructor(private threeService: ThreeService) {}

  ngOnInit() {
    this.threeService.init(this.containerRef.nativeElement);
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) {
    this.threeService.handleInteraction(event);
  }
}
