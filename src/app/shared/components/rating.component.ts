import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-0.5">
      @for (star of stars(); track $index) {
        @if (star === 'full') {
          <svg class="w-4 h-4 text-saffron-500 fill-saffron-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        } @else if (star === 'half') {
          <!-- Special split design using masks for half star rendering -->
          <span class="relative w-4 h-4 text-saffron-500">
            <svg class="absolute top-0 left-0 w-4 h-4 text-peppercorn-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <svg class="absolute top-0 left-0 w-4 h-4 fill-saffron-500 clip-half" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="clip-path: inset(0 50% 0 0);">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </span>
        } @else {
          <svg class="w-4 h-4 text-peppercorn-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        }
      }
      @if (showText()) {
        <span class="text-xs text-peppercorn-500 font-medium ml-1">({{ rating() | number:'1.1-1' }})</span>
      }
    </div>
  `
})
export class RatingComponent {
  readonly rating = input<number>(5);
  readonly showText = input<boolean>(true);

  protected readonly stars = computed(() => {
    const list: ('full' | 'half' | 'empty')[] = [];
    const val = Math.max(0, Math.min(5, this.rating()));
    const fullCount = Math.floor(val);
    const fraction = val - fullCount;

    for (let i = 0; i < fullCount; i++) {
      list.push('full');
    }
    if (fraction >= 0.25 && fraction <= 0.75) {
      list.push('half');
    } else if (fraction > 0.75) {
      list.push('full');
    }
    while (list.length < 5) {
      list.push('empty');
    }
    return list;
  });
}
