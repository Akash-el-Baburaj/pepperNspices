import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone, inject } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly zone = inject(NgZone);

  @Input('appTilt') maxTilt = 8; // Maximum rotation in degrees
  @Input() scale = 1.02; // Slight zoom on hover

  private isMobile = false;
  private prefersReducedMotion = false;
  private moveListener: ((e: MouseEvent) => void) | null = null;
  private leaveListener: (() => void) | null = null;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!this.isMobile && !this.prefersReducedMotion) {
        const nativeEl = this.el.nativeElement;
        nativeEl.style.transition = 'transform 0.15s ease-out';
        nativeEl.style.transformStyle = 'preserve-3d';

        this.zone.runOutsideAngular(() => {
          this.moveListener = (e: MouseEvent) => this.onMouseMove(e);
          this.leaveListener = () => this.onMouseLeave();

          nativeEl.addEventListener('mousemove', this.moveListener);
          nativeEl.addEventListener('mouseleave', this.leaveListener);
        });
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    const nativeEl = this.el.nativeElement;
    const rect = nativeEl.getBoundingClientRect();

    // Mouse positions relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert coordinates to ratios ranging from -0.5 to 0.5
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    // Calculate rotations (rotateY is linked to horizontal position, rotateX to vertical)
    const rotateY = px * this.maxTilt * 2;
    const rotateX = -py * this.maxTilt * 2;

    requestAnimationFrame(() => {
      nativeEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.scale}, ${this.scale}, 1)`;
    });
  }

  private onMouseLeave() {
    requestAnimationFrame(() => {
      const nativeEl = this.el.nativeElement;
      nativeEl.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  ngOnDestroy() {
    const nativeEl = this.el.nativeElement;
    if (this.moveListener) {
      nativeEl.removeEventListener('mousemove', this.moveListener);
    }
    if (this.leaveListener) {
      nativeEl.removeEventListener('mouseleave', this.leaveListener);
    }
  }
}
