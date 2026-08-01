import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone, inject } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly zone = inject(NgZone);

  // Speed factor: e.g. -0.15 for background moving slower, +0.15 for moving faster
  @Input('appParallax') speed = -0.15;

  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private isDisabled = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.checkStatus();
      if (!this.isDisabled) {
        this.initParallax();
      }

      // Re-evaluate on window resize
      this.zone.runOutsideAngular(() => {
        this.resizeListener = () => {
          this.checkStatus();
          if (this.isDisabled) {
            this.resetStyles();
            this.removeScrollListener();
          } else {
            this.initParallax();
          }
        };
        window.addEventListener('resize', this.resizeListener, { passive: true });
      });
    }
  }

  private checkStatus() {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isDisabled = isMobile || prefersReducedMotion;
  }

  private initParallax() {
    if (this.scrollListener) return;

    this.zone.runOutsideAngular(() => {
      this.scrollListener = () => this.updatePosition();
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      // Initial positioning
      this.updatePosition();
    });
  }

  private updatePosition() {
    const nativeEl = this.el.nativeElement;
    const rect = nativeEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Only animate if element is within the viewport
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Calculate how far the center of the element is from the center of the screen
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      
      const offset = distanceFromCenter * this.speed;

      requestAnimationFrame(() => {
        nativeEl.style.transform = `translate3d(0, ${offset}px, 0)`;
        nativeEl.style.willChange = 'transform';
      });
    }
  }

  private resetStyles() {
    requestAnimationFrame(() => {
      this.el.nativeElement.style.transform = '';
      this.el.nativeElement.style.willChange = '';
    });
  }

  private removeScrollListener() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
  }

  ngOnDestroy() {
    this.removeScrollListener();
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
