import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heat-level',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1">
      <span class="text-xs font-semibold text-peppercorn-600 uppercase tracking-wider mr-1">Heat:</span>
      @if (level() === 0) {
        <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Cool / Sweet</span>
      } @else {
        <div class="flex items-center gap-0.5" [title]="heatLabel()">
          @for (chili of [1, 2, 3, 4, 5]; track $index) {
            <svg class="w-4 h-4 transition-all duration-200" 
                 [class.text-chili-500]="chili <= level()"
                 [class.fill-chili-500]="chili <= level()"
                 [class.text-peppercorn-200]="chili > level()"
                 [class.fill-none]="chili > level()"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2c0 0-4 4.5-4 8.5C8 14.5 11 18 11 22c0 0 8-5 8-11.5C19 6.5 12 2 12 2z"/>
              <path d="M12 22c0 0-3-3-3-6.5C9 12.5 12 9 12 9c0 0 4 3 4 6.5s-3 6.5-3 6.5z" class="opacity-80"/>
            </svg>
          }
          <span class="text-[11px] font-bold ml-1" [class]="heatColorClass()">{{ heatLabel() }}</span>
        </div>
      }
    </div>
  `
})
export class HeatLevelComponent {
  readonly level = input<number>(0);

  protected readonly heatLabel = computed(() => {
    const l = this.level();
    if (l === 0) return 'Mild';
    if (l <= 1) return 'Warm';
    if (l <= 2) return 'Spicy';
    if (l <= 3) return 'Hot';
    if (l <= 4) return 'Fiery';
    return 'Extreme';
  });

  protected readonly heatColorClass = computed(() => {
    const l = this.level();
    if (l === 0) return 'text-emerald-600';
    if (l <= 2) return 'text-saffron-600';
    if (l <= 4) return 'text-chili-600';
    return 'text-chili-800 font-extrabold animate-pulse';
  });
}
