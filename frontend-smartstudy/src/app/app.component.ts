import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';
import { LoaderComponent } from './shared/loader.component';
import { LoaderService } from './core/loader.service';
import { AuthStore } from './core/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  template: '<router-outlet /><app-loader />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly loader = inject(LoaderService);
  private readonly auth = inject(AuthStore);

  constructor() {
    if (this.auth.token()) this.auth.restoreSession().subscribe();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          if (this.loader.consumeNavigationSkip()) return;
          this.loader.show();
          return;
        }

        this.loader.hide();
      });
  }
}
