import { GameStorage } from '../storage/db.js';

export interface SettingsCallbacks {
  onThemeChanged: (theme: 'light' | 'dark') => void;
  onDataRestored: () => void;
}

export class SettingsModal {
  private callbacks: SettingsCallbacks;

  constructor(callbacks: SettingsCallbacks) {
    this.callbacks = callbacks;
  }

  show() {
    const storage = GameStorage.getInstance();
    const stats = storage.getStats();
    const settings = storage.getSettings();
    const breeds = storage.getUnlockedBreeds();

    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';

    modal.innerHTML = `
      <div class="bg-[var(--bg-surface)] text-[var(--text-main)] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[var(--border-color)] flex flex-col gap-4 max-h-[90dvh] overflow-y-auto">
        <!-- Cabeçalho -->
        <div class="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
          <div class="flex items-center gap-2">
            <span class="text-2xl">⚙️</span>
            <h2 class="text-xl font-bold m-0">Ajustes & Estatísticas</h2>
          </div>
          <button id="btn-close-settings" class="text-xl p-1 rounded-lg hover:bg-[var(--bg-card)]">✕</button>
        </div>

        <!-- Estatísticas -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Suas Conquistas</h3>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-color)]">
              <span class="text-xs text-[var(--text-muted)] block font-medium">Partidas</span>
              <span class="text-lg font-black">${stats.gamesWon}</span>
            </div>
            <div class="bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-color)]">
              <span class="text-xs text-[var(--text-muted)] block font-medium">Sequência</span>
              <span class="text-lg font-black">${stats.currentStreak} 🔥</span>
            </div>
            <div class="bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-color)]">
              <span class="text-xs text-[var(--text-muted)] block font-medium">Recorde</span>
              <span class="text-lg font-black">${stats.bestStreak} 🏆</span>
            </div>
          </div>
        </div>

        <!-- Coleção de Raças -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Cachorrinhos Conhecidos (${breeds.length})</h3>
          <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
            ${breeds.map(b => `<span class="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] font-medium">🐾 ${b}</span>`).join('')}
          </div>
        </div>

        <!-- Tema Noturno / Claro -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
          <div class="flex items-center gap-2">
            <span class="text-lg">${settings.theme === 'dark' ? '🌙' : '☀️'}</span>
            <span class="text-sm font-semibold">Modo Noturno (Aconchegante)</span>
          </div>
          <button id="btn-toggle-theme" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
            ${settings.theme === 'dark' ? 'Ativado' : 'Desativado'}
          </button>
        </div>

        <!-- Backup & Restauração -->
        <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-2.5">
          <div>
            <h3 class="text-sm font-bold text-[var(--text-main)] m-0">Backup da Conta</h3>
            <p class="text-xs text-[var(--text-muted)] m-0 mt-0.5">Transfira ou guarde seu histórico e recordes offline.</p>
          </div>

          <div class="flex gap-2">
            <button id="btn-export-backup" class="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5">
              <span>📥</span>
              <span>Exportar Backup</span>
            </button>
            <button id="btn-import-backup" class="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5">
              <span>📤</span>
              <span>Restaurar Backup</span>
            </button>
            <input type="file" id="file-import" accept=".json" class="hidden" />
          </div>
        </div>

        <!-- Rodapé -->
        <div class="text-center pt-2">
          <p class="text-[11px] text-[var(--text-muted)] m-0">Borkdoku v1.0.0 • 100% Offline • Sem Rastreamento</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos
    document.getElementById('btn-close-settings')?.addEventListener('click', () => modal.remove());

    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
      const current = storage.getSettings().theme;
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      storage.saveSettings({ theme: nextTheme });
      this.callbacks.onThemeChanged(nextTheme);
      modal.remove();
      this.show();
    });

    document.getElementById('btn-export-backup')?.addEventListener('click', () => {
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
          modal.remove();
          this.callbacks.onDataRestored();
        }
      }
    });
  }
}
