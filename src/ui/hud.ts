import { type LevelDefinition } from '../engine/levels.js';

export interface HudCallbacks {
  onToggleSound: () => void;
  onReset: () => void;
  onOpenSettings: (tab?: 'levels' | 'collection' | 'achievements' | 'settings') => void;
  onNextLevel: () => void;
}

export class HudComponent {
  private container: HTMLElement;
  private callbacks: HudCallbacks;
  private timerInterval: number | null = null;
  private secondsElapsed: number = 0;
  private lives: number = 3;
  private dogsRemaining: number = 0;
  private totalDogs: number = 0;

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

  setLives(lives: number) {
    this.lives = Math.max(0, Math.min(3, lives));
    const el = document.getElementById('hud-lives');
    if (el) {
      el.innerHTML = this.getHeartsHtml();
    }
  }

  setDogsRemaining(remaining: number, total: number) {
    this.dogsRemaining = Math.max(0, remaining);
    this.totalDogs = total;
    const el = document.getElementById('hud-dogs-remaining');
    if (el) {
      el.textContent = `${this.dogsRemaining} / ${this.totalDogs}`;
    }
  }

  private getHeartsHtml(): string {
    let html = '';
    for (let i = 0; i < 3; i++) {
      if (i < this.lives) {
        html += `<span class="text-sm select-none transition-transform hover:scale-110">❤️</span>`;
      } else {
        html += `<span class="text-sm select-none opacity-30 grayscale">🖤</span>`;
      }
    }
    return html;
  }

  renderHeader(level: LevelDefinition, isMuted: boolean, lives: number = 3, dogsRemaining: number = level.size) {
    this.lives = lives;
    this.dogsRemaining = dogsRemaining;
    this.totalDogs = level.size;

    const headerHtml = `
      <header class="flex flex-col gap-2 w-full mb-2 select-none">
        <!-- Barra de Título & Ações Principais -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-3xl animate-wag">🐶</span>
            <div id="btn-header-level" class="cursor-pointer" title="Ver Níveis e Dificuldades">
              <h1 class="text-xl font-bold tracking-tight text-[var(--text-main)] m-0 leading-tight">Borkdoku</h1>
              <p class="text-xs text-[var(--text-muted)] m-0 font-medium hover:text-[var(--accent-gold)] transition-all">${level.name} (${level.difficulty} • ${level.size}x${level.size}) ▾</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button id="btn-levels" class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm active:scale-95 transition-transform cursor-pointer" aria-label="Níveis e Coleção" title="Níveis e Coleção">
              🐾
            </button>
            <button id="btn-sound" class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm active:scale-95 transition-transform cursor-pointer" aria-label="Som">
              ${isMuted ? '🔇' : '🔊'}
            </button>
            <button id="btn-reset" class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm active:scale-95 transition-transform cursor-pointer" aria-label="Reiniciar">
              🔄
            </button>
            <button id="btn-settings" class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm active:scale-95 transition-transform cursor-pointer" aria-label="Configurações">
              ⚙️
            </button>
          </div>
        </div>

        <!-- Barra de Status: Timer, Vidas e Contador de Cães Restantes -->
        <div class="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs shadow-sm font-semibold">
          <div class="flex items-center gap-1">
            <span class="text-sm">⏱️</span>
            <span id="hud-timer" class="font-mono text-sm tracking-wider text-[var(--text-main)]">${this.getTimeFormatted()}</span>
          </div>

          <div class="flex items-center gap-1 bg-[var(--bg-card)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
            <span class="text-[11px] text-[var(--text-muted)] font-bold mr-0.5">VIDAS:</span>
            <div id="hud-lives" class="flex items-center gap-0.5">
              ${this.getHeartsHtml()}
            </div>
          </div>

          <div class="flex items-center gap-1.5 bg-[var(--bg-card)] px-2.5 py-0.5 rounded-full border border-[var(--border-color)] font-bold text-xs text-[var(--text-main)]">
            <span class="text-sm">🐶</span>
            <span class="text-[var(--text-muted)]">Faltam:</span>
            <strong id="hud-dogs-remaining" class="font-black text-xs text-[var(--accent-gold)] font-mono">${this.dogsRemaining} / ${this.totalDogs}</strong>
          </div>
        </div>

        <!-- Regras Colapsáveis Acima do Tabuleiro -->
        <div class="w-full mt-1">
          <button id="btn-toggle-rules" class="w-full py-1.5 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--text-main)] shadow-sm cursor-pointer transition-all hover:brightness-105 active:scale-98">
            <span class="flex items-center gap-1.5">
              <span>📖</span>
              <span>Como Jogar & Regras</span>
            </span>
            <span id="rules-arrow" class="text-xs font-mono transition-transform">▾</span>
          </button>

          <div id="rules-content" class="hidden flex-col gap-2 p-3 mt-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs shadow-md animate-fade-in">
            <div class="flex items-start gap-2">
              <span class="text-base leading-none">🐶</span>
              <p class="m-0 text-[var(--text-main)] leading-snug"><strong>1 cão por região:</strong> Cada território colorido deve ter exatamente 1 cachorrinho.</p>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-base leading-none">↔️</span>
              <p class="m-0 text-[var(--text-main)] leading-snug"><strong>1 por linha e coluna:</strong> Dois cachorrinhos nunca podem dividir a mesma linha ou coluna.</p>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-base leading-none">🐾</span>
              <p class="m-0 text-[var(--text-main)] leading-snug"><strong>Espaço pessoal:</strong> Cães não podem se tocar, nem nos cantos diagonais!</p>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-base leading-none">❤️</span>
              <p class="m-0 text-[var(--text-main)] leading-snug"><strong>3 Vidas:</strong> Cão colocado errado consome 1 vida e trava a casa com ossinho fixo.</p>
            </div>
            <div class="flex items-start gap-2 pt-1 border-t border-[var(--border-color)]">
              <span class="text-base leading-none">💡</span>
              <p class="m-0 text-[var(--text-muted)] leading-snug"><strong>Controles:</strong> Toque para 🦴 ossinho, 2 toques para 🐶 cão, ou <strong>arraste</strong> para colocar vários ossinhos.</p>
            </div>
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

    document.getElementById('btn-levels')?.addEventListener('click', () => this.callbacks.onOpenSettings('levels'));
    document.getElementById('btn-header-level')?.addEventListener('click', () => this.callbacks.onOpenSettings('levels'));
    document.getElementById('btn-sound')?.addEventListener('click', this.callbacks.onToggleSound);
    document.getElementById('btn-reset')?.addEventListener('click', this.callbacks.onReset);
    document.getElementById('btn-settings')?.addEventListener('click', () => this.callbacks.onOpenSettings('settings'));

    // Evento de abrir/fechar as regras colapsáveis
    document.getElementById('btn-toggle-rules')?.addEventListener('click', () => {
      const content = document.getElementById('rules-content');
      const arrow = document.getElementById('rules-arrow');
      if (content) {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          content.classList.add('flex');
          if (arrow) arrow.textContent = '▴';
        } else {
          content.classList.add('hidden');
          content.classList.remove('flex');
          if (arrow) arrow.textContent = '▾';
        }
      }
    });
  }

  renderBottomControls() {
    const controlsHtml = `
      <div id="hud-controls" class="w-full mt-2 mb-1 select-none flex flex-col items-center gap-1.5">
        <!-- Dica concisa de gestos (sem botões poluindo o rodapé) -->
        <div class="w-full py-1.5 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center text-xs font-semibold text-[var(--text-muted)] flex items-center justify-around">
          <span>👆 <strong>Toque:</strong> 🦴 ossinho</span>
          <span class="opacity-30">•</span>
          <span>✌️ <strong>2 Toques:</strong> 🐶 cão</span>
          <span class="opacity-30">•</span>
          <span>🖐️ <strong>Arraste:</strong> múltiplos 🦴</span>
        </div>

        <!-- Convite sutil e visível ao repositório GitHub -->
        <a
          href="https://github.com/sergiohcosta/borkdoku"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-medium hover:underline cursor-pointer"
          title="Ver o código-fonte e apoiar com uma estrela no GitHub"
        >
          <span>Gostou do joguinho?</span>
          <span class="font-bold text-[var(--accent-gold)]">⭐ Dá uma estrela pro repositório</span>
        </a>
      </div>
    `;

    const existing = document.getElementById('hud-controls');
    if (existing) {
      existing.outerHTML = controlsHtml;
    } else {
      this.container.insertAdjacentHTML('beforeend', controlsHtml);
    }
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
          <span class="absolute -top-1 -right-2 text-2xl animate-sparkle">✨</span>
        </div>

        <div>
          <h2 class="text-2xl font-black m-0 text-[var(--accent-gold)]">Au au! Vitória!</h2>
          <p class="text-sm text-[var(--text-muted)] mt-1 mb-0">Você acomodou todos os cachorrinhos sem nenhum conflito!</p>
        </div>

        <div id="btn-victory-collection" class="bg-[var(--bg-card)] rounded-2xl p-3 w-full flex items-center justify-around border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-gold)] transition-colors" title="Ver no Álbum de Cães">
          <div>
            <span class="text-xs text-[var(--text-muted)] block font-semibold">TEMPO</span>
            <span class="text-lg font-black font-mono">${timeStr}</span>
          </div>
          <div class="w-[1px] h-8 bg-[var(--border-color)]"></div>
          <div>
            <span class="text-xs text-[var(--text-muted)] block font-semibold">COLEÇÃO ▾</span>
            <span class="text-sm font-bold flex items-center gap-1 justify-center">
              <span>${level.breedIcon}</span>
              <span>${level.breed}</span>
            </span>
          </div>
        </div>

        <div class="w-full flex flex-col items-center gap-2 mt-1">
          <button id="btn-modal-next" class="w-full py-3.5 px-4 rounded-2xl bg-[var(--accent-gold)] text-white font-extrabold text-base shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer">
            Próxima Fase 🐾
          </button>

          <a
            href="https://github.com/sergiohcosta/borkdoku"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-semibold py-1.5 px-3.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] active:scale-95"
            title="Apoie o projeto no GitHub"
          >
            <span>Gostou do joguinho?</span>
            <span class="font-extrabold text-[var(--accent-gold)]">⭐ Dá uma estrela no GitHub</span>
          </a>
        </div>

        <p class="text-[11px] text-[var(--text-muted)] m-0 font-medium">✨ 100% livre de propagandas para você relaxar.</p>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-modal-next')?.addEventListener('click', () => {
      modal.remove();
      this.callbacks.onNextLevel();
    });

    document.getElementById('btn-victory-collection')?.addEventListener('click', () => {
      modal.remove();
      this.callbacks.onOpenSettings('collection');
    });
  }

  showGameOverModal(onRetry: () => void) {
    const modal = document.createElement('div');
    modal.id = 'gameover-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
    modal.innerHTML = `
      <div class="bg-[var(--bg-surface)] text-[var(--text-main)] rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-[var(--accent-red)] text-center flex flex-col items-center gap-4">
        <span class="text-6xl block">🐾💔</span>
        <div>
          <h2 class="text-2xl font-black m-0 text-[var(--accent-red)]">Patinhas Cansadas!</h2>
          <p class="text-sm text-[var(--text-muted)] mt-1 mb-0">Você perdeu as 3 vidas nesta fase ao colocar cachorrinhos em posições erradas.</p>
        </div>
        <div class="w-full mt-2">
          <button id="btn-modal-retry" class="w-full py-3.5 px-4 rounded-2xl bg-[var(--accent-gold)] text-white font-extrabold text-base shadow-md active:scale-95 transition-all cursor-pointer">
            Tentar Novamente 🔄
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-modal-retry')?.addEventListener('click', () => {
      modal.remove();
      onRetry();
    });
  }
}
