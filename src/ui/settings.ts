import { GameStorage } from '../storage/db.js';
import { DOG_BREEDS, DIFFICULTY_TIERS, getTierForLevel } from '../engine/levels.js';
import { TelemetryService } from '../engine/telemetry.js';

export interface SettingsCallbacks {
  onThemeChanged: (theme: 'light' | 'dark') => void;
  onDataRestored: () => void;
  onLevelSelected?: (levelId: string) => void;
  onInstallPWA?: () => Promise<'accepted' | 'dismissed' | 'manual-help'>;
}

export type HubTab = 'levels' | 'collection' | 'achievements' | 'settings';

function formatTime(seconds?: number): string {
  if (typeof seconds !== 'number' || seconds <= 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export class SettingsModal {
  private callbacks: SettingsCallbacks;
  private currentTab: HubTab = 'levels';
  private modalEl: HTMLElement | null = null;
  private collectionFilter: 'all' | 'unlocked' | 'locked' = 'all';

  constructor(callbacks: SettingsCallbacks) {
    this.callbacks = callbacks;
  }

  show(initialTab: HubTab = 'levels') {
    this.currentTab = initialTab;
    if (this.modalEl) {
      this.modalEl.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in';
    this.modalEl = modal;

    modal.innerHTML = `
      <div class="hub-dialog bg-[var(--bg-surface)] text-[var(--text-main)] rounded-3xl p-5 shadow-2xl border border-[var(--border-color)] flex flex-col gap-3.5">
        <!-- Topo: Título & Fechar -->
        <div class="flex items-center justify-between pb-2 border-b border-[var(--border-color)] shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-2xl animate-wag">🐶</span>
            <div>
              <h2 class="text-lg font-black m-0 leading-tight">Central do Borkdoku</h2>
              <p class="text-[11px] text-[var(--text-muted)] m-0 font-medium">Níveis, Coleção de Cães & Ajustes</p>
            </div>
          </div>
          <button id="btn-close-settings" class="p-1.5 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold text-base cursor-pointer" aria-label="Fechar">✕</button>
        </div>

        <!-- Barra de Abas -->
        <div class="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[var(--bg-card)] shrink-0">
          <button class="hub-tab ${this.currentTab === 'levels' ? 'active' : ''}" data-tab="levels">
            <span>🗺️</span>
            <span>Níveis</span>
          </button>
          <button class="hub-tab ${this.currentTab === 'collection' ? 'active' : ''}" data-tab="collection">
            <span>🐶</span>
            <span>Álbum</span>
          </button>
          <button class="hub-tab ${this.currentTab === 'achievements' ? 'active' : ''}" data-tab="achievements">
            <span>📊</span>
            <span>Recordes</span>
          </button>
          <button class="hub-tab ${this.currentTab === 'settings' ? 'active' : ''}" data-tab="settings">
            <span>⚙️</span>
            <span>Ajustes</span>
          </button>
        </div>

        <!-- Conteúdo Rolável da Aba -->
        <div id="hub-content" class="hub-scroll-area pr-1 flex flex-col gap-3">
          <!-- Renderizado via renderTabContent -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos principais
    document.getElementById('btn-close-settings')?.addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // No desktop, permite que rolar a roda do mouse em qualquer lugar do modal role o conteúdo
    modal.addEventListener('wheel', (e) => {
      const content = document.getElementById('hub-content');
      if (content && e.target !== content && !content.contains(e.target as Node)) {
        content.scrollTop += e.deltaY;
      }
    }, { passive: true });

    // Cliques nas abas
    modal.querySelectorAll('.hub-tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = (e.currentTarget as HTMLElement).dataset.tab as HubTab;
        if (target) {
          this.currentTab = target;
          modal.querySelectorAll('.hub-tab').forEach(b => b.classList.remove('active'));
          (e.currentTarget as HTMLElement).classList.add('active');
          this.renderTabContent();
        }
      });
    });

    this.renderTabContent();
  }

  close() {
    if (this.modalEl) {
      this.modalEl.remove();
      this.modalEl = null;
    }
  }

  private renderTabContent() {
    const container = document.getElementById('hub-content');
    if (!container) return;

    if (this.currentTab === 'levels') {
      this.renderLevelsTab(container);
    } else if (this.currentTab === 'collection') {
      this.renderCollectionTab(container);
    } else if (this.currentTab === 'achievements') {
      this.renderAchievementsTab(container);
    } else if (this.currentTab === 'settings') {
      this.renderSettingsTab(container);
    }
  }

  // ==========================================
  // ABA 1: NÍVEIS & RANGES DE DIFICULDADE
  // ==========================================
  private renderLevelsTab(container: HTMLElement) {
    const storage = GameStorage.getInstance();
    const currentLevelId = storage.getCurrentLevelId();
    const currentNum = parseInt(currentLevelId.replace('level-', ''), 10) || 1;
    const currentTier = getTierForLevel(currentNum);

    container.innerHTML = `
      <!-- Seletor / Pular Nível Direto -->
      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-2.5">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-[var(--text-main)] block">Salto Rápido de Fase</span>
            <span class="text-[11px] text-[var(--text-muted)] block">Digite qualquer nível (1 a 1000+)</span>
          </div>
          <div class="flex items-center gap-1.5">
            ${storage.getCleanClearCount() > 0 ? `
              <span class="text-xs font-black px-2 py-1 rounded-xl bg-amber-500/10 border border-[var(--accent-gold)] text-[var(--accent-gold)] flex items-center gap-1" title="Fases resolvidas com Faro Puro (sem dicas)">
                ✨ ${storage.getCleanClearCount()}
              </span>
            ` : ''}
            <span class="text-xs font-black px-2.5 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--accent-gold)]">
              Fase ${currentNum} (${currentTier.name})
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="number"
            id="input-jump-level"
            min="1"
            max="1000"
            value="${currentNum}"
            class="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-bold text-[var(--text-main)] outline-none"
          />
          <button id="btn-jump-level" class="py-2 px-3.5 rounded-xl bg-[var(--accent-gold)] text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer">
            Ir para Fase 🐾
          </button>
        </div>
      </div>

      <!-- Título dos Ranges -->
      <div class="flex items-center justify-between pt-1">
        <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] m-0">Faixas de Dificuldade</h3>
        <span class="text-[11px] text-[var(--text-muted)] font-medium">7 Níveis de Mestria</span>
      </div>

      <!-- Lista de Tiers de Dificuldade -->
      <div class="flex flex-col gap-2">
        ${DIFFICULTY_TIERS.map((tier) => {
          const isCurrent = currentNum >= tier.minLevel && currentNum <= tier.maxLevel;
          const completedInTier = storage.getCompletedCountInTier(tier.minLevel, tier.maxLevel);
          const totalInTier = tier.maxLevel - tier.minLevel + 1;
          const percent = Math.min(100, Math.round((completedInTier / totalInTier) * 100));

          return `
            <div class="p-3 rounded-2xl bg-[var(--bg-card)] border ${isCurrent ? 'border-[var(--accent-gold)] shadow-sm' : 'border-[var(--border-color)]'} flex flex-col gap-2 transition-all">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${tier.icon}</span>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <h4 class="text-sm font-bold text-[var(--text-main)] m-0">${tier.name}</h4>
                      ${isCurrent ? '<span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[var(--accent-gold)] text-white">Você está aqui</span>' : ''}
                    </div>
                    <span class="text-[11px] text-[var(--text-muted)] block font-medium">Fases ${tier.minLevel} a ${tier.maxLevel} • ${tier.tagline}</span>
                  </div>
                </div>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] shrink-0">
                  ${tier.difficulty}
                </span>
              </div>

              <p class="text-xs text-[var(--text-muted)] m-0 leading-relaxed font-medium">
                ${tier.description}
              </p>

              <!-- Barra de Progresso do Tier -->
              <div class="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-0.5">
                <span>Progresso: <b>${completedInTier}</b> de ${totalInTier} fases</span>
                <span class="font-bold text-[var(--text-main)]">${percent}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${percent}%;"></div>
              </div>

              <!-- Botão de Ação -->
              <div class="pt-1 flex justify-end">
                <button
                  class="btn-select-tier px-3 py-1.5 rounded-xl text-xs font-bold ${isCurrent ? 'bg-[var(--accent-gold)] text-white' : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)]'} shadow-sm active:scale-95 transition-all cursor-pointer"
                  data-level="${isCurrent ? currentNum : tier.minLevel}"
                >
                  ${isCurrent ? `Continuar Fase ${currentNum} 🐾` : `Jogar Nível ${tier.minLevel} 🚀`}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Eventos do seletor
    document.getElementById('btn-jump-level')?.addEventListener('click', () => {
      const input = document.getElementById('input-jump-level') as HTMLInputElement | null;
      if (input && input.value) {
        const val = parseInt(input.value, 10);
        if (!isNaN(val) && val >= 1 && val <= 1000) {
          this.selectLevel(`level-${val}`);
        }
      }
    });

    container.querySelectorAll('.btn-select-tier').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetLevel = (e.currentTarget as HTMLElement).dataset.level;
        if (targetLevel) {
          this.selectLevel(`level-${targetLevel}`);
        }
      });
    });
  }

  // ==========================================
  // ABA 2: ÁLBUM DE CACHORRINHOS DESCOBERTOS
  // ==========================================
  private renderCollectionTab(container: HTMLElement) {
    TelemetryService.getInstance().recordFeature('album_opened');
    const storage = GameStorage.getInstance();
    const unlockedBreeds = storage.getUnlockedBreeds();
    const totalBreeds = DOG_BREEDS.length;
    const unlockedCount = unlockedBreeds.length;
    const progressPercent = Math.round((unlockedCount / totalBreeds) * 100);

    const filteredBreeds = DOG_BREEDS.map((breed, index) => {
      const isUnlocked = unlockedBreeds.includes(breed.name);
      return {
        ...breed,
        firstLevel: index + 1,
        isUnlocked
      };
    }).filter(b => {
      if (this.collectionFilter === 'unlocked') return b.isUnlocked;
      if (this.collectionFilter === 'locked') return !b.isUnlocked;
      return true;
    });

    container.innerHTML = `
      <!-- Cabeçalho do Álbum -->
      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-[var(--text-main)] m-0">Canil dos Campeões</h3>
            <p class="text-xs text-[var(--text-muted)] m-0 mt-0.5">Vença fases para resgatar e colecionar todas as raças!</p>
          </div>
          <span class="text-xs font-black px-2.5 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--accent-gold)]">
            ${unlockedCount} / ${totalBreeds}
          </span>
        </div>

        <div class="progress-track mt-1">
          <div class="progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <span class="text-[11px] text-[var(--text-muted)] font-medium text-right">${progressPercent}% do álbum completo</span>
      </div>

      <!-- Filtros Rápidos -->
      <div class="flex items-center gap-1.5 pt-1">
        <button class="btn-filter-breed px-2.5 py-1 rounded-lg text-xs font-bold ${this.collectionFilter === 'all' ? 'bg-[var(--accent-gold)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]'} cursor-pointer" data-filter="all">
          Todos (${totalBreeds})
        </button>
        <button class="btn-filter-breed px-2.5 py-1 rounded-lg text-xs font-bold ${this.collectionFilter === 'unlocked' ? 'bg-[var(--accent-gold)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]'} cursor-pointer" data-filter="unlocked">
          Descobertos (${unlockedCount})
        </button>
        <button class="btn-filter-breed px-2.5 py-1 rounded-lg text-xs font-bold ${this.collectionFilter === 'locked' ? 'bg-[var(--accent-gold)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]'} cursor-pointer" data-filter="locked">
          Bloqueados (${totalBreeds - unlockedCount})
        </button>
      </div>

      <!-- Grade das 60 Raças de Cachorrinhos -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        ${filteredBreeds.map((dog) => {
          if (dog.isUnlocked) {
            return `
              <div class="breed-card p-3 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] shadow-sm flex flex-col items-center text-center gap-1.5">
                <span class="text-3xl block animate-wag">${dog.icon}</span>
                <span class="text-xs font-black text-[var(--text-main)] block leading-tight truncate w-full">${dog.name}</span>
                <span class="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-500/10">✨ Descoberto</span>
                <span class="text-[10px] text-[var(--text-muted)] font-medium">Fase ${dog.firstLevel}</span>
              </div>
            `;
          } else {
            return `
              <div class="breed-card p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] opacity-70 flex flex-col items-center text-center gap-1.5">
                <span class="text-3xl block grayscale opacity-40">🔒</span>
                <span class="text-xs font-bold text-[var(--text-muted)] block leading-tight truncate w-full">???</span>
                <span class="text-[10px] font-semibold text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-[var(--bg-surface)]">Bloqueado</span>
                <span class="text-[10px] text-[var(--text-muted)] font-medium">Jogue a Fase ${dog.firstLevel}</span>
              </div>
            `;
          }
        }).join('')}
      </div>
    `;

    // Eventos dos filtros
    container.querySelectorAll('.btn-filter-breed').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const filter = (e.currentTarget as HTMLElement).dataset.filter as 'all' | 'unlocked' | 'locked';
        if (filter) {
          this.collectionFilter = filter;
          this.renderCollectionTab(container);
        }
      });
    });
  }

  // ==========================================
  // ABA 3: CONQUISTAS, RECORDES & HISTÓRICO
  // ==========================================
  private renderAchievementsTab(container: HTMLElement) {
    const storage = GameStorage.getInstance();
    const stats = storage.getStats();
    const completedSet = storage.getCompletedLevelNumbers();
    const highestLevel = storage.getHighestLevelReached();
    const recentLevels = storage.getRecentCompletedLevels(8);

    container.innerHTML = `
      <!-- Destaques 2x2 + Faro Puro -->
      <div class="grid grid-cols-2 gap-2">
        <div class="col-span-2 bg-gradient-to-r from-amber-500/10 to-transparent p-3 rounded-2xl border border-[var(--accent-gold)] flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-3xl">✨</span>
            <div>
              <span class="text-xs font-black text-[var(--accent-gold)] block">SELO FARO PURO</span>
              <span class="text-[11px] text-[var(--text-muted)] font-medium">Fases vencidas sem usar nenhuma dica</span>
            </div>
          </div>
          <span class="text-xl font-black text-[var(--accent-gold)] font-mono">${storage.getCleanClearCount()} 🐾</span>
        </div>
        <div class="bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-color)] text-center">
          <span class="text-xs text-[var(--text-muted)] font-semibold block">Fases Únicas Vencidas</span>
          <span class="text-xl font-black text-[var(--accent-gold)] block mt-0.5">${completedSet.size}</span>
          <span class="text-[10px] text-[var(--text-muted)] font-medium">Total de vitórias: ${stats.gamesWon}</span>
        </div>
        <div class="bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-color)] text-center">
          <span class="text-xs text-[var(--text-muted)] font-semibold block">Maior Nível Atingido</span>
          <span class="text-xl font-black text-[var(--text-main)] block mt-0.5">Nível ${highestLevel}</span>
          <span class="text-[10px] text-[var(--text-muted)] font-medium">Rumo à Lenda Canina</span>
        </div>
        <div class="bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-color)] text-center">
          <span class="text-xs text-[var(--text-muted)] font-semibold block">Sequência Atual</span>
          <span class="text-xl font-black text-[var(--text-main)] block mt-0.5">${stats.currentStreak} 🔥</span>
          <span class="text-[10px] text-[var(--text-muted)] font-medium">Sem derrotas seguidas</span>
        </div>
        <div class="bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-color)] text-center">
          <span class="text-xs text-[var(--text-muted)] font-semibold block">Melhor Sequência</span>
          <span class="text-xl font-black text-[var(--accent-gold)] block mt-0.5">${stats.bestStreak} 🏆</span>
          <span class="text-[10px] text-[var(--text-muted)] font-medium">Recorde histórico</span>
        </div>
      </div>

      <!-- Recordes de Velocidade por Tamanho -->
      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] m-0">Melhores Tempos por Tamanho</h4>
        <div class="grid grid-cols-4 gap-1.5 text-center pt-1">
          <div class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span class="text-[10px] font-bold text-[var(--text-muted)] block">5x5</span>
            <span class="text-xs font-mono font-black block">${formatTime(stats.bestTimesBySize[5])}</span>
          </div>
          <div class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span class="text-[10px] font-bold text-[var(--text-muted)] block">6x6</span>
            <span class="text-xs font-mono font-black block">${formatTime(stats.bestTimesBySize[6])}</span>
          </div>
          <div class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span class="text-[10px] font-bold text-[var(--text-muted)] block">7x7</span>
            <span class="text-xs font-mono font-black block">${formatTime(stats.bestTimesBySize[7])}</span>
          </div>
          <div class="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span class="text-[10px] font-bold text-[var(--text-muted)] block">8x8</span>
            <span class="text-xs font-mono font-black block">${formatTime(stats.bestTimesBySize[8])}</span>
          </div>
        </div>
      </div>

      <!-- Histórico Recente de Vitórias -->
      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] m-0">Fases Concluídas Recentemente</h4>
        ${recentLevels.length > 0 ? `
          <div class="flex flex-col gap-1.5 pt-1">
            ${recentLevels.map((item) => `
              <div class="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span class="font-bold text-[var(--text-main)]">${item.levelId.replace('level-', 'Fase ')}</span>
                  <span class="text-[10px] text-[var(--text-muted)] font-medium">(${item.size}x${item.size})</span>
                  ${item.cleanClear ? '<span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-[var(--accent-gold)] text-[var(--accent-gold)]" title="Vitória sem dicas!">✨ Faro Puro</span>' : ''}
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[11px] font-bold text-[var(--text-muted)]">${formatTime(item.durationSeconds)}</span>
                  <button class="btn-replay-level px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[var(--accent-gold)] text-white cursor-pointer" data-id="${item.levelId}">
                    Jogar
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <p class="text-xs text-[var(--text-muted)] m-0 py-2 text-center font-medium">
            Nenhuma fase concluída ainda. Jogue seu primeiro desafio para ver o histórico aqui! 🐾
          </p>
        `}
      </div>
    `;

    container.querySelectorAll('.btn-replay-level').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) {
          this.selectLevel(id);
        }
      });
    });
  }

  // ==========================================
  // ABA 4: AJUSTES & BACKUP
  // ==========================================
  private renderSettingsTab(container: HTMLElement) {
    const storage = GameStorage.getInstance();
    const settings = storage.getSettings();

    container.innerHTML = `
      <!-- Tema Noturno / Claro -->
      <div class="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">${settings.theme === 'dark' ? '🌙' : '☀️'}</span>
          <div>
            <h4 class="text-xs font-bold text-[var(--text-main)] m-0">Modo Noturno Aconchegante</h4>
            <p class="text-[11px] text-[var(--text-muted)] m-0 mt-0.5">Cores escuras suaves para jogar à noite</p>
          </div>
        </div>
        <button id="btn-toggle-theme" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm cursor-pointer">
          ${settings.theme === 'dark' ? 'Ativado' : 'Desativado'}
        </button>
      </div>

      <!-- Backup & Restauração -->
      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-2.5">
        <div>
          <h4 class="text-xs font-bold text-[var(--text-main)] m-0">Backup da Conta</h4>
          <p class="text-[11px] text-[var(--text-muted)] m-0 mt-0.5">Transfira ou guarde seu histórico e recordes offline.</p>
        </div>

        <div class="flex gap-2">
          <button id="btn-export-backup" class="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>📥</span>
            <span>Exportar Backup</span>
          </button>
          <button id="btn-import-backup" class="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>📤</span>
            <span>Restaurar Backup</span>
          </button>
          <input type="file" id="file-import" accept=".json" class="hidden" />
        </div>
      </div>

      <!-- Privacidade & Telemetria Anônima -->
      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-2.5">
        <div class="flex items-start gap-2.5">
          <span class="text-xl">🔒</span>
          <div>
            <h4 class="text-xs font-bold text-[var(--text-main)] m-0">Privacidade & Telemetria Anônima</h4>
            <p class="text-[11px] text-[var(--text-muted)] m-0 mt-0.5 leading-relaxed">
              Coletamos <strong>exclusivamente dados anônimos de jogabilidade</strong> (como tempo da fase, vitórias e uso de dicas) para calibrar a dificuldade do jogo. Nenhum dado pessoal, IP ou identificador é registrado. Zero cookies, zero anúncios.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-[var(--border-color)]">
          <span class="text-xs font-semibold text-[var(--text-main)]">Ajudar no balanceamento das fases</span>
          <button id="btn-toggle-telemetry" class="px-3 py-1.5 rounded-xl text-xs font-bold ${settings.telemetryEnabled ? 'bg-[var(--accent-gold)] text-white' : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]'} shadow-sm cursor-pointer transition-all">
            ${settings.telemetryEnabled ? '✓ Ativado' : '✕ Desativado'}
          </button>
        </div>
      </div>

      <!-- Instalar como Aplicativo PWA -->
      <div id="card-pwa-install" class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">📲</span>
          <div>
            <h4 class="text-xs font-bold text-[var(--text-main)] m-0">Instalar como Aplicativo</h4>
            <p class="text-[11px] text-[var(--text-muted)] m-0 mt-0.5">Jogue em tela cheia na sua tela inicial, 100% offline.</p>
          </div>
        </div>
        <button
          id="btn-pwa-install"
          class="py-1.5 px-3 rounded-xl bg-[var(--accent-gold)] text-white text-xs font-extrabold shadow-sm hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          Instalar 🐾
        </button>
      </div>

      <!-- Repositório GitHub / Estrela -->
      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">⭐</span>
          <div>
            <h4 class="text-xs font-bold text-[var(--text-main)] m-0">Gostou do Borkdoku?</h4>
            <p class="text-[11px] text-[var(--text-muted)] m-0 mt-0.5">Dá uma estrela pro repositório no GitHub!</p>
          </div>
        </div>
        <a
          id="link-github-settings"
          href="https://github.com/sergiohcosta/borkdoku"
          target="_blank"
          rel="noopener noreferrer"
          class="py-1.5 px-3 rounded-xl bg-[var(--accent-gold)] text-white text-xs font-extrabold shadow-sm hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          Dar ⭐
        </a>
      </div>

      <!-- Rodapé Institucional -->
      <div class="text-center pt-2">
        <p class="text-[11px] text-[var(--text-muted)] m-0 font-medium leading-relaxed">
          Borkdoku v1.2.0 • 100% Offline • Sem Rastreamento Pessoal<br />
          Feito com carinho para amantes de quebra-cabeças caninos 🐶
        </p>
      </div>
    `;

    document.getElementById('btn-pwa-install')?.addEventListener('click', async () => {
      const res = await this.callbacks.onInstallPWA?.();
      if (res === 'manual-help' || res === 'dismissed') {
        const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          alert('No Safari do iPhone/iPad:\nToque no botão Compartilhar (quadrado com seta) e selecione "Adicionar à Tela de Início". 📲🐶');
        } else {
          alert('No Chrome:\nToque nos três pontinhos (⋮) no topo direito e selecione "Instalar aplicativo" ou "Adicionar à tela inicial". 📲🐶');
        }
      }
    });

    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
      const current = storage.getSettings().theme;
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      storage.saveSettings({ theme: nextTheme });
      this.callbacks.onThemeChanged(nextTheme);
      this.renderSettingsTab(container);
    });

    document.getElementById('btn-toggle-telemetry')?.addEventListener('click', () => {
      const current = storage.getSettings().telemetryEnabled;
      storage.saveSettings({ telemetryEnabled: !current });
      this.renderSettingsTab(container);
    });

    document.getElementById('link-github-settings')?.addEventListener('click', () => {
      TelemetryService.getInstance().recordFeature('github_star_clicked', 'settings_tab');
    });

    document.getElementById('btn-export-backup')?.addEventListener('click', () => {
      TelemetryService.getInstance().recordFeature('backup_exported');
      storage.downloadBackupFile();
    });

    const fileInput = document.getElementById('file-import') as HTMLInputElement | null;
    document.getElementById('btn-import-backup')?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const text = await file.text();
        const res = storage.restoreBackup(text);
        alert(res.message);
        if (res.success) {
          TelemetryService.getInstance().recordFeature('backup_imported');
          this.close();
          this.callbacks.onDataRestored();
        }
      }
    });
  }

  private selectLevel(levelId: string) {
    const storage = GameStorage.getInstance();
    storage.setCurrentLevelId(levelId);
    this.close();
    this.callbacks.onLevelSelected?.(levelId);
  }
}
