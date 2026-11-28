import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoaderService } from '../core/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (loader.visible()) {
      <div class="loader-overlay" role="status" aria-live="polite" aria-label="Cargando SmartStudyAI">
        <div class="study-loader">
          <svg class="study-loader__robot" viewBox="0 0 160 155" aria-hidden="true">
            <defs>
              <linearGradient id="loader-shell" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#fff" />
                <stop offset=".55" stop-color="#e9e4ff" />
                <stop offset="1" stop-color="#b6a9f7" />
              </linearGradient>
              <linearGradient id="loader-purple" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#9c7cff" />
                <stop offset="1" stop-color="#4e3bda" />
              </linearGradient>
              <radialGradient id="loader-screen">
                <stop stop-color="#25234c" />
                <stop offset="1" stop-color="#101329" />
              </radialGradient>
              <filter id="loader-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g class="study-loader__antenna">
              <rect x="75" y="19" width="10" height="24" rx="5" fill="url(#loader-purple)" />
              <circle cx="80" cy="18" r="12" fill="url(#loader-purple)" />
              <ellipse cx="76" cy="13" rx="4" ry="2" fill="#ffffff88" />
            </g>
            <rect x="10" y="65" width="27" height="54" rx="13" fill="url(#loader-purple)" />
            <rect x="123" y="65" width="27" height="54" rx="13" fill="url(#loader-purple)" />
            <rect x="22" y="36" width="116" height="103" rx="47" fill="url(#loader-shell)" stroke="#ffffff" stroke-width="2" />
            <rect x="35" y="57" width="90" height="64" rx="26" fill="url(#loader-screen)" stroke="#8d80d7" stroke-width="2" />
            <g class="study-loader__eyes" fill="none" stroke="#91f4ff" stroke-width="6" stroke-linecap="round" filter="url(#loader-glow)">
              <path d="M49 86 Q59 70 69 86" />
              <path d="M91 86 Q101 70 111 86" />
            </g>
            <path class="study-loader__mouth" d="M71 101 Q80 110 89 101" fill="none" stroke="#a5f8ff" stroke-width="4" stroke-linecap="round" />
            <path d="M42 51 Q76 35 114 51" stroke="#fff" stroke-width="4" opacity=".65" fill="none" stroke-linecap="round" />
          </svg>

          <div class="study-loader__dots" aria-hidden="true"><i></i><i></i><i></i></div>
          <span class="study-loader__label">{{ loader.message() }}</span>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  readonly loader = inject(LoaderService);
}
