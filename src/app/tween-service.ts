import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class TweenService {
  to(target: any, vars: gsap.TweenVars): gsap.core.Tween {
    return gsap.to(target, vars);
  }

  from(target: any, vars: gsap.TweenVars): gsap.core.Tween {
    return gsap.from(target, vars);
  }

  fromTo(target: any, fromVars: gsap.TweenVars, toVars: gsap.TweenVars): gsap.core.Tween {
    return gsap.fromTo(target, fromVars, toVars);
  }

  timeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
    return gsap.timeline(vars);
  }
}
