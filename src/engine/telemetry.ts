import { GameStorage } from '../storage/db.js';

export type ViolationType = 'diagonal' | 'row-col' | 'region' | 'wrong-spot';
export type TelemetrySender = (path: string, title: string) => void;

export function getDurationBucket(seconds: number): string {
  if (seconds < 30) return '<30s';
  if (seconds < 60) return '30s-1m';
  if (seconds < 120) return '1m-2m';
  if (seconds < 180) return '2m-3m';
  if (seconds < 300) return '3m-5m';
  return '>5m';
}

export function getTimeToFirstDogBucket(seconds: number): string {
  if (seconds < 10) return '<10s';
  if (seconds < 30) return '10-30s';
  if (seconds < 60) return '30-60s';
  return '>60s';
}

export interface LevelSessionState {
  levelNumber: number;
  size: number;
  difficulty: string;
  startTime: number;
  firstDogPlacedTime: number | null;
  dragBoneUsed: boolean;
  hintsUsedCount: number;
  restartsCount: number;
  isFinished: boolean;
}

export class TelemetryService {
  private static instance: TelemetryService;
  private currentSession: LevelSessionState | null = null;
  private customSender: TelemetrySender | null = null;

  static getInstance(): TelemetryService {
    if (!this.instance) {
      this.instance = new TelemetryService();
    }
    return this.instance;
  }

  /**
   * Permite injetar um emissor customizado para testes automatizados.
   */
  setCustomSender(sender: TelemetrySender | null) {
    this.customSender = sender;
  }

  /**
   * Dispara um evento anônimo via GoatCounter ou emissor customizado.
   */
  sendEvent(path: string, title: string): boolean {
    const storage = GameStorage.getInstance();
    // Respeita estritamente a preferência do usuário (opt-out)
    if (!storage.getSettings().telemetryEnabled) {
      return false;
    }

    if (this.customSender) {
      this.customSender(path, title);
      return true;
    }

    try {
      if (typeof window !== 'undefined') {
        const gc = (window as unknown as { goatcounter?: { count: (options: { path: string; title: string; event: boolean }) => void } }).goatcounter;
        if (gc && typeof gc.count === 'function') {
          gc.count({ path, title, event: true });
          return true;
        }
      }
    } catch (e) {
      // Telemetria nunca deve quebrar o jogo
      console.debug('Telemetry skipped or failed silently:', e);
    }
    return false;
  }

  // ==========================================
  // CICLO DE VIDA DA FASE
  // ==========================================

  startLevel(levelNumber: number, size: number, difficulty: string) {
    // Se havia uma fase anterior iniciada que não foi finalizada nem reiniciada, registra abandono
    if (this.currentSession && !this.currentSession.isFinished && this.currentSession.levelNumber !== levelNumber) {
      this.recordAbandon();
    }

    const previousRestarts = (this.currentSession && this.currentSession.levelNumber === levelNumber)
      ? this.currentSession.restartsCount
      : 0;

    this.currentSession = {
      levelNumber,
      size,
      difficulty,
      startTime: Date.now(),
      firstDogPlacedTime: null,
      dragBoneUsed: false,
      hintsUsedCount: 0,
      restartsCount: previousRestarts,
      isFinished: false
    };
  }

  recordFirstDogPlaced() {
    if (!this.currentSession || this.currentSession.firstDogPlacedTime !== null) return;
    this.currentSession.firstDogPlacedTime = Date.now();
  }

  recordDragBone() {
    if (!this.currentSession || this.currentSession.dragBoneUsed) return;
    this.currentSession.dragBoneUsed = true;
    this.sendEvent('feature/drag_bone_used', 'Gesto de arrastar ossos utilizado');
  }

  recordRestart() {
    if (!this.currentSession) return;
    this.currentSession.restartsCount++;
    this.sendEvent(
      `game/restart/${this.currentSession.levelNumber}`,
      `Reinício na Fase ${this.currentSession.levelNumber}`
    );
  }

  recordHint(hintType: string) {
    if (!this.currentSession) return;
    this.currentSession.hintsUsedCount++;
    this.sendEvent(
      `game/hint/${this.currentSession.levelNumber}/${hintType}`,
      `Dica (${hintType}) na Fase ${this.currentSession.levelNumber}`
    );
  }

  recordGameOver(violation: ViolationType = 'wrong-spot') {
    if (!this.currentSession) return;
    this.currentSession.isFinished = true;
    this.sendEvent(
      `game/over/${this.currentSession.levelNumber}/${violation}`,
      `Game Over na Fase ${this.currentSession.levelNumber} (${violation})`
    );
  }

  recordWin(durationSeconds: number, isCleanClear: boolean, livesRemaining: number) {
    if (!this.currentSession) return;
    this.currentSession.isFinished = true;

    const lvl = this.currentSession.levelNumber;
    const durBucket = getDurationBucket(durationSeconds);
    const clearType = isCleanClear ? 'puro' : 'dica';

    // 1. Evento principal de vitória com tempo e selo
    this.sendEvent(
      `game/win/${lvl}/${clearType}/${durBucket}`,
      `Vitória Fase ${lvl} (${clearType}, ${durBucket}, ${livesRemaining} vidas)`
    );

    // 2. Tempo até o primeiro cãozinho colocado (âncora óbvia vs hesitação inicial)
    if (this.currentSession.firstDogPlacedTime) {
      const firstDogSecs = Math.round((this.currentSession.firstDogPlacedTime - this.currentSession.startTime) / 1000);
      const firstDogBucket = getTimeToFirstDogBucket(firstDogSecs);
      this.sendEvent(
        `game/anchor/${lvl}/${firstDogBucket}`,
        `Tempo até 1º cão na Fase ${lvl}: ${firstDogBucket}`
      );
    }
  }

  recordAbandon() {
    if (!this.currentSession || this.currentSession.isFinished) return;
    this.currentSession.isFinished = true;
    this.sendEvent(
      `game/abandon/${this.currentSession.levelNumber}`,
      `Fase ${this.currentSession.levelNumber} abandonada antes do fim`
    );
  }

  // ==========================================
  // EVENTOS DE PRODUTO & AMBIENTE
  // ==========================================

  recordFeature(featureName: string, detail: string = '') {
    const path = detail ? `feature/${featureName}/${detail}` : `feature/${featureName}`;
    this.sendEvent(path, `Feature usada: ${featureName} ${detail}`.trim());
  }

  recordEnvironment(theme: string, isMobile: boolean) {
    this.sendEvent(`env/theme/${theme}`, `Tema ativo: ${theme}`);
    this.sendEvent(`env/device/${isMobile ? 'mobile' : 'desktop'}`, `Dispositivo: ${isMobile ? 'mobile' : 'desktop'}`);
  }

  getCurrentSession(): LevelSessionState | null {
    return this.currentSession;
  }
}
