import { type LevelDefinition } from '../engine/levels.js';
import { type InputMode } from './board.js';

export interface HudCallbacks {
  onToggleSound: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
  onNextLevel: () => void;
  onSelectMode: (mode: InputMode) => void;
}

export class HudComponent {
  private container: HTMLElement;
  private callbacks: HudCallbacks;
  private timerInterval: number | null = null;
  private secondsElapsed: number = 0;
  private currentMode: InputMode = 'toggle';

  constructor(container: HTMLElement, callbacks: HudCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  startTimer() {
    this.stopTimer();
    this.secondsElapsed = 0;
    this.updateTimerDisplay();
    this.timerInterval = window.setInterval(() => {
      this.secondsElapsed++;
      this.updateTimerDisplay();
    }, 1000);
  }

  stopTimer(): number {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    return this.secondsElapsed;
  }

  getTimeFormatted(): string {
    const mins = Math.floor(this.secondsElapsed / 60);
    const secs = this.secondsElapsed % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private updateTimerDisplay() {
    const el = document.getElementById('hud-timer');
    if (el) {
      el.textContent = this.getTimeFormatted();
    }
  }

  renderHeader(level: LevelDefinition, isMuted: boolean) {
    const headerHtml = `
      <header class="flex flex-col gap-2 w-full mb-3 select-none">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-3xl animate-wag">🐶</span>
            <div>
              <h1 class="text-xl font-bold tracking-tight text-[var(--text-main)] m-0 leading-tight">Borkdoku</h1>
              <p class="text-xs text-[var(--text-muted)] m-0 font-medium">${level.name} (${level.size}x${level.size})</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-sound" class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm active:scale-95 transition-transform" aria-label="Som">
              ${isMuted ? '🔇' : '🔊'}
            </button>
            <button id="btn-reset" class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm active:scale-95 transition-transform" aria-label="Reiniciar">
              🔄
            </button>
            <button id="btn-settings" class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm active:scale-95 transition-transform" aria-label="Configurações">
              ⚙️
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm shadow-sm font-semibold">
          <div class="flex items-center gap-1.5">
            <span class="text-base">⏱️</span>
            <span id="hud-timer" class="font-mono text-base tracking-wider text-[var(--text-main)]">${this.getTimeFormatted()}</span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span class="px-2 py-0.5 rounded-full bg-[var(--bg-card)] font-bold text-[var(--text-main)]">${level.difficulty}</span>
          </div>
        </div>
      </header>
    `;

    const existingHeader = this.container.querySelector('header');
    if (existingHeader) {
      existingHeader.outerHTML = headerHtml;
    } else {
      this.container.insertAdjacentHTML('afterbegin', headerHtml);
    }

    document.getElementById('btn-sound')?.addEventListener('click', this.callbacks.onToggleSound);
    document.getElementById('btn-reset')?.addEventListener('click', this.callbacks.onReset);
    document.getElementById('btn-settings')?.addEventListener('click', this.callbacks.onOpenSettings);
  }

  renderBottomControls(currentMode: InputMode) {
    this.currentMode = currentMode;
    const controlsHtml = `
      <div id="hud-controls" class="flex items-center justify-center gap-2 w-full mt-4 select-none">
        <button id="mode-toggle" class="flex-1 py-2.5 px-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
          this.currentMode === 'toggle'
            ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] scale-[1.02]'
            : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)]'
        }">
          <span>🔄</span>
          <span>Alternar</span>
        </button>

        <button id="mode-dog" class="flex-1 py-2.5 px-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
          this.currentMode === 'dog'
            ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] scale-[1.02]'
            : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)]'
        }">
          <span class="text-lg">🐶</span>
          <span>Cachorrinho</span>
        </button>

        <button id="mode-bone" class="flex-1 py-2.5 px-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
          this.currentMode === 'bone'
            ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] scale-[1.02]'
            : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)]'
        }">
          <span class="text-sm">🦴</span>
          <span>Ossinho</span>
        </button>
      </div>
    `;

    const existing = document.getElementById('hud-controls');
    if (existing) {
      existing.outerHTML = controlsHtml;
    } else {
      this.container.insertAdjacentHTML('beforeend', controlsHtml);
    }

    document.getElementById('mode-toggle')?.addEventListener('click', () => this.callbacks.onSelectMode('toggle'));
    document.getElementById('mode-dog')?.addEventListener('click', () => this.callbacks.onSelectMode('dog'));
    document.getElementById('mode-bone')?.addEventListener('click', () => this.callbacks.onSelectMode('bone'));
  }

  showVictoryModal(level: LevelDefinition, timeSeconds: number) {
    const mins = Math.floor(timeSeconds / 60);
    const secs = timeSeconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const modal = document.createElement('div');
    modal.id = 'victory-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
    modal.innerHTML = `
      <div class="bg-[var(--bg-surface)] text-[var(--text-main)] rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-[var(--accent-gold)] text-center flex flex-col items-center gap-4 animate-scale-up">
        <div class="relative">
          <span class="text-7xl block animate-wag">🐶</span>
          <span class="absolute -top-1 -right-2 text-2xl animate-bounce">✨</span>
        </div>

        <div>
          <h2 class="text-2xl font-black m-0 text-[var(--accent-gold)]">Au au! Vitória!</h2>
          <p class="text-sm text-[var(--text-muted)] mt-1 mb-0">Você acomodou todos os cachorrinhos sem nenhum conflito!</p>
        </div>

        <div class="bg-[var(--bg-card)] rounded-2xl p-3 w-full flex items-center justify-around border border-[var(--border-color)]">
          <div>
            <span class="text-xs text-[var(--text-muted)] block font-semibold">TEMPO</span>
            <span class="text-lg font-black font-mono">${timeStr}</span>
          </div>
          <div class="w-[1px] h-8 bg-[var(--border-color)]"></div>
          <div>
            <span class="text-xs text-[var(--text-muted)] block font-semibold">COLEÇÃO</span>
            <span class="text-sm font-bold flex items-center gap-1 justify-center">
              <span>${level.breedIcon}</span>
              <span>${level.breed}</span>
            </span>
          </div>
        </div>

        <div class="w-full flex flex-col gap-2 mt-2">
          <button id="btn-modal-next" class="w-full py-3.5 px-4 rounded-2xl bg-[var(--accent-gold)] text-white font-extrabold text-base shadow-md hover:brightness-105 active:scale-95 transition-all">
            Próxima Fase 🐾
          </button>
        </div>

        <p class="text-[11px] text-[var(--text-muted)] m-0 font-medium">✨ 100% livre de propagandas para você relaxar.</p>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-modal-next')?.addEventListener('click', () => {
      modal.remove();
      this.callbacks.onNextLevel();
    });
  }
}
