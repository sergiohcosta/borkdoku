export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  bestTimesBySize: Record<number, number>; // tamanho (5..8) -> menor tempo em segundos
}

export interface CompletedLevel {
  levelId: string;
  size: number;
  durationSeconds: number;
  completedAt: string;
  cleanClear?: boolean; // Venceu sem usar nenhuma dica (Selo Faro Puro)
}

export interface PlayerSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'light' | 'dark';
  inputMode: 'toggle' | 'dog-only' | 'bone-only';
}

export interface BackupData {
  schemaVersion: '1.0';
  exportedAt: string;
  stats: PlayerStats;
  completedLevels: CompletedLevel[];
  unlockedBreeds: string[];
  settings: PlayerSettings;
}

const STORAGE_KEY_STATS = 'borkdoku_stats';
const STORAGE_KEY_LEVELS = 'borkdoku_levels';
const STORAGE_KEY_BREEDS = 'borkdoku_breeds';
const STORAGE_KEY_SETTINGS = 'borkdoku_settings';
const STORAGE_KEY_CURRENT_LEVEL = 'borkdoku_current_level';

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestTimesBySize: {}
};

const DEFAULT_SETTINGS: PlayerSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'light',
  inputMode: 'toggle'
};

export class GameStorage {
  private static instance: GameStorage;

  static getInstance(): GameStorage {
    if (!this.instance) {
      this.instance = new GameStorage();
    }
    return this.instance;
  }

  // --- LEVEL ATIVO ---
  getCurrentLevelId(): string {
    try {
      return localStorage.getItem(STORAGE_KEY_CURRENT_LEVEL) || 'level-1';
    } catch {
      return 'level-1';
    }
  }

  setCurrentLevelId(levelId: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_LEVEL, levelId);
    } catch (e) {
      console.warn('Erro ao salvar nível atual:', e);
    }
  }

  // --- STATS ---
  getStats(): PlayerStats {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STATS);
      return data ? JSON.parse(data) : { ...DEFAULT_STATS };
    } catch {
      return { ...DEFAULT_STATS };
    }
  }

  saveStats(stats: PlayerStats): void {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Erro ao salvar stats no localStorage:', e);
    }
  }

  // --- LEVELS ---
  getCompletedLevels(): CompletedLevel[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LEVELS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  recordLevelCompletion(
    levelId: string,
    size: number,
    durationSeconds: number,
    breedName: string,
    cleanClear: boolean = false
  ): PlayerStats {
    const levels = this.getCompletedLevels();
    const existingIndex = levels.findIndex(l => l.levelId === levelId);
    const wasAlreadyClean = existingIndex !== -1 && Boolean(levels[existingIndex].cleanClear);

    const newRecord: CompletedLevel = {
      levelId,
      size,
      durationSeconds,
      completedAt: new Date().toISOString(),
      cleanClear: cleanClear || wasAlreadyClean
    };

    if (existingIndex !== -1) {
      if (durationSeconds < levels[existingIndex].durationSeconds) {
        levels[existingIndex].durationSeconds = durationSeconds;
      }
      if (cleanClear) {
        levels[existingIndex].cleanClear = true;
      }
    } else {
      levels.push(newRecord);
    }

    try {
      localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(levels));
    } catch (e) {
      console.warn('Erro ao salvar levels:', e);
    }

    // Atualizar raças desbloqueadas
    this.unlockBreed(breedName);

    // Atualizar estatísticas
    const stats = this.getStats();
    stats.gamesPlayed += 1;
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }

    const currentBest = stats.bestTimesBySize[size];
    if (!currentBest || durationSeconds < currentBest) {
      stats.bestTimesBySize[size] = durationSeconds;
    }

    this.saveStats(stats);
    return stats;
  }

  getCleanClearCount(): number {
    return this.getCompletedLevels().filter(l => l.cleanClear).length;
  }

  isLevelCleanCleared(levelNumber: number): boolean {
    const id = `level-${levelNumber}`;
    return this.getCompletedLevels().some(l => l.levelId === id && l.cleanClear);
  }

  getCompletedLevelNumbers(): Set<number> {
    const list = this.getCompletedLevels();
    const set = new Set<number>();
    for (const item of list) {
      const match = item.levelId.match(/\d+/);
      if (match) {
        set.add(parseInt(match[0], 10));
      }
    }
    return set;
  }

  isLevelCompleted(levelNumber: number): boolean {
    return this.getCompletedLevelNumbers().has(levelNumber);
  }

  getCompletedLevelsCount(): number {
    return this.getCompletedLevelNumbers().size;
  }

  getCompletedCountInTier(minLevel: number, maxLevel: number): number {
    const completedSet = this.getCompletedLevelNumbers();
    let count = 0;
    for (const num of completedSet) {
      if (num >= minLevel && num <= maxLevel) {
        count++;
      }
    }
    return count;
  }

  getHighestLevelReached(): number {
    const completedSet = this.getCompletedLevelNumbers();
    const currentNum = parseInt(this.getCurrentLevelId().replace('level-', ''), 10) || 1;
    let max = currentNum;
    for (const num of completedSet) {
      if (num > max) max = num;
    }
    return max;
  }

  getRecentCompletedLevels(limit: number = 8): CompletedLevel[] {
    const list = this.getCompletedLevels();
    return [...list].reverse().slice(0, limit);
  }

  // --- BREEDS ---
  getUnlockedBreeds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BREEDS);
      const list = data ? JSON.parse(data) : [];
      if (!list.includes('Golden Retriever')) {
        list.push('Golden Retriever'); // Raça inicial padrão
      }
      return list;
    } catch {
      return ['Golden Retriever'];
    }
  }

  unlockBreed(breed: string): void {
    if (!breed) return;
    const breeds = this.getUnlockedBreeds();
    if (!breeds.includes(breed)) {
      breeds.push(breed);
      try {
        localStorage.setItem(STORAGE_KEY_BREEDS, JSON.stringify(breeds));
      } catch (e) {
        console.warn('Erro ao salvar raça:', e);
      }
    }
  }

  // --- SETTINGS ---
  getSettings(): PlayerSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings(settings: Partial<PlayerSettings>): PlayerSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar settings:', e);
    }
    return updated;
  }

  // --- BACKUP & RESTAURAÇÃO ---
  generateBackupJSON(): string {
    const backup: BackupData = {
      schemaVersion: '1.0',
      exportedAt: new Date().toISOString(),
      stats: this.getStats(),
      completedLevels: this.getCompletedLevels(),
      unlockedBreeds: this.getUnlockedBreeds(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  }

  downloadBackupFile(): void {
    const jsonStr = this.generateBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `borkdoku-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  restoreBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data: BackupData = JSON.parse(jsonString);
      if (data.schemaVersion !== '1.0') {
        return { success: false, message: 'Versão de backup incompatível.' };
      }
      if (!data.stats || !Array.isArray(data.completedLevels)) {
        return { success: false, message: 'Arquivo de backup com formato inválido ou corrompido.' };
      }

      this.saveStats(data.stats);
      localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(data.completedLevels));
      localStorage.setItem(STORAGE_KEY_BREEDS, JSON.stringify(data.unlockedBreeds || ['Golden Retriever']));
      if (data.settings) {
        this.saveSettings(data.settings);
      }

      return {
        success: true,
        message: `Backup restaurado com sucesso! (${data.completedLevels.length} fases recuperadas)`
      };
    } catch {
      return { success: false, message: 'Falha ao processar arquivo JSON de backup.' };
    }
  }

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY_STATS);
    localStorage.removeItem(STORAGE_KEY_LEVELS);
    localStorage.removeItem(STORAGE_KEY_BREEDS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_LEVEL);
  }
}
