import { Injectable, signal } from '@angular/core';

const MINIMUM_DISPLAY_TIME = 2000;

@Injectable({ providedIn: 'root' })
export class LoaderService {
  readonly visible = signal(false);
  readonly message = signal('Preparando tu espacio de estudio...');

  private startedAt = 0;
  private runId = 0;
  private hideTimer: ReturnType<typeof setTimeout> | undefined;
  private skipNavigation = false;

  show(message = 'Preparando tu espacio de estudio...'): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }

    this.runId += 1;
    this.startedAt = Date.now();
    this.message.set(message);
    this.visible.set(true);
  }

  hide(): void {
    if (!this.visible()) return;

    const currentRunId = this.runId;
    const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - (Date.now() - this.startedAt));
    this.hideTimer = setTimeout(() => {
      if (currentRunId !== this.runId) return;
      this.visible.set(false);
      this.hideTimer = undefined;
    }, remainingTime);
  }

  skipNextNavigation(): void {
    this.skipNavigation = true;
    this.runId += 1;

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }

    this.visible.set(false);
  }

  consumeNavigationSkip(): boolean {
    const shouldSkip = this.skipNavigation;
    this.skipNavigation = false;
    return shouldSkip;
  }

  async run<T>(task: Promise<T> | (() => Promise<T>), message = 'Preparando tu espacio de estudio...'): Promise<T> {
    this.show(message);

    try {
      return await (typeof task === 'function' ? task() : task);
    } finally {
      this.hide();
    }
  }
}
