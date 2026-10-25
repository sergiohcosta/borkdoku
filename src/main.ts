import { createEmptyBoard, validateBoard, cellKey, type BoardState, type CellCoord } from './engine/rules.js';
import { getLevelById, getNextLevel, type LevelDefinition } from './engine/levels.js';
import { GameStorage } from './storage/db.js';
import { SoundManager } from './audio/sound.js';
import { BoardComponent } from './ui/board.js';
import { HudComponent } from './ui/hud.js';
import { SettingsModal } from './ui/settings.js';

class BorkdokuApp {
  private storage: GameStorage;
  private sound: SoundManager;
  private hud!: HudComponent;
  private boardComponent!: BoardComponent;
  private settingsModal!: SettingsModal;

  private currentLevel: LevelDefinition;
  private board: BoardState;
  private lives: number = 3;
  private directPlacementMode: 'normal' | 'dog' | 'bone' = 'normal';
  private lockedCells: Set<string> = new Set<string>();

  constructor() {
    this.storage = GameStorage.getInstance();
    this.sound = SoundManager.getInstance();

    // Recupera o nível exato onde o jogador parou (persistência progressiva até 500+)
    const savedLevelId = this.storage.getCurrentLevelId();
    this.currentLevel = getLevelById(savedLevelId);

    this.board = createEmptyBoard(this.currentLevel.size);

    this.applyTheme();
    this.initUI();
    this.startLevel(this.currentLevel);
    this.registerServiceWorker();
  }

  private applyTheme() {
    const settings = this.storage.getSettings();
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  private initUI() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    appEl.innerHTML = '';

    const boardContainer = document.createElement('main');
    boardContainer.className = 'board-wrapper';
    appEl.appendChild(boardContainer);

    // Inicializar HUD com suporte a Vidas e Controles
    this.hud = new HudComponent(appEl, {
      onToggleSound: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.renderHeader(this.currentLevel, isMuted, this.lives);
      },
      onReset: () => {
        this.resetLevel();
      },
      onOpenSettings: () => {
        this.settingsModal.show();
      },
      onNextLevel: () => {
        const next = getNextLevel(this.currentLevel.id);
        this.startLevel(next);
      },
      onSelectDogMode: () => {
        this.directPlacementMode = this.directPlacementMode === 'dog' ? 'normal' : 'dog';
        this.showModeToast(this.directPlacementMode === 'dog' ? 'Modo Cão Ativo (toque para colocar)' : 'Modo Padrão');
      },
      onSelectBoneMode: () => {
        this.directPlacementMode = this.directPlacementMode === 'bone' ? 'normal' : 'bone';
        this.showModeToast(this.directPlacementMode === 'bone' ? 'Modo Ossinho Ativo (toque para marcar)' : 'Modo Padrão');
      }
    });

    // Inicializar Tabuleiro com clique simples e clique duplo
    this.boardComponent = new BoardComponent(boardContainer, {
      onCellSingleClick: (coord) => this.handleCellSingleClick(coord),
      onCellDoubleClick: (coord) => this.handleCellDoubleClick(coord)
    });

    // Inicializar Modal de Ajustes
    this.settingsModal = new SettingsModal({
      onThemeChanged: () => this.applyTheme(),
      onDataRestored: () => {
        this.applyTheme();
        const restoredId = this.storage.getCurrentLevelId();
        const lvl = getLevelById(restoredId);
        this.startLevel(lvl);
      },
      onLevelSelected: (levelId) => {
        const lvl = getLevelById(levelId);
        this.startLevel(lvl);
      }
    });

    this.hud.renderBottomControls();
  }

  private showModeToast(message: string) {
    const oldToast = document.getElementById('mode-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'mode-toast';
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-bold shadow-lg z-40 animate-fade-in pointer-events-none';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  }

  startLevel(level: LevelDefinition) {
    this.currentLevel = level;
    this.storage.setCurrentLevelId(level.id); // Salva imediatamente no localStorage
    this.lives = 3; // Inicia com 3 vidas
    this.lockedCells.clear(); // Limpa as travas
    this.board = createEmptyBoard(level.size);

    this.hud.renderHeader(this.currentLevel, this.sound.getMuted(), this.lives);
    this.hud.startTimer();
    this.updateBoardAndValidate();
  }

  resetLevel() {
    this.lives = 3;
    this.lockedCells.clear();
    this.board = createEmptyBoard(this.currentLevel.size);
    this.hud.setLives(this.lives);
    this.hud.startTimer();
    this.updateBoardAndValidate();
    this.sound.playRemove();
  }

  // 1 Clique: Coloca ou remove ossinho de apoio (ou remove cão existente)
  handleCellSingleClick(coord: CellCoord) {
    if (this.lives <= 0) return;

    const key = cellKey(coord.row, coord.col);
    if (this.lockedCells.has(key)) return; // Casa travada não aceita cliques

    if (this.directPlacementMode === 'dog') {
      this.attemptPlaceDog(coord);
      return;
    }

    const current = this.board[coord.row][coord.col];
    if (current === 'empty') {
      this.board[coord.row][coord.col] = 'bone';
      this.sound.playBone();
    } else if (current === 'bone') {
      this.board[coord.row][coord.col] = 'empty';
      this.sound.playRemove();
    } else if (current === 'dog') {
      this.board[coord.row][coord.col] = 'empty';
      this.sound.playRemove();
    }

    this.updateBoardAndValidate();
  }

  // 2 Cliques: Coloca cachorrinho (ou remove se já houver cão)
  handleCellDoubleClick(coord: CellCoord) {
    if (this.lives <= 0) return;

    const key = cellKey(coord.row, coord.col);
    if (this.lockedCells.has(key)) return; // Casa travada não aceita cliques

    const current = this.board[coord.row][coord.col];
    if (current === 'dog') {
      this.board[coord.row][coord.col] = 'empty';
      this.sound.playRemove();
      this.updateBoardAndValidate();
      return;
    }

    this.attemptPlaceDog(coord);
  }

  // Tentativa de posicionamento com validação estrita, sistema de 3 vidas e trava de ossinho
  private attemptPlaceDog(coord: CellCoord) {
    const key = cellKey(coord.row, coord.col);
    if (this.lockedCells.has(key)) return;

    // Verifica se esta coordenada é a solução correta para esta linha
    const isCorrect = this.currentLevel.solution[coord.row] === coord.col;

    // Se estiver errado: perde 1 vida e trava a casa como ossinho!
    if (!isCorrect) {
      this.lives = Math.max(0, this.lives - 1);
      this.hud.setLives(this.lives);
      this.sound.playConflict();

      // Marca imediatamente a casa como ossinho e trava para não deixar clicar de novo
      this.board[coord.row][coord.col] = 'bone';
      this.lockedCells.add(key);
      this.updateBoardAndValidate();
      this.boardComponent.flashErrorCell(coord);

      // Se perdeu todas as vidas: Game Over!
      if (this.lives <= 0) {
        this.hud.stopTimer();
        setTimeout(() => {
          this.hud.showGameOverModal(() => {
            this.resetLevel();
          });
        }, 300);
      }
      return;
    }

    // Se estiver correto: posiciona o cachorrinho com sucesso!
    this.board[coord.row][coord.col] = 'dog';
    this.sound.playDog();
    this.updateBoardAndValidate();
  }

  updateBoardAndValidate() {
    const val = validateBoard(this.board, this.currentLevel.regions);
    this.boardComponent.update(this.board, this.currentLevel.regions, val, this.lockedCells);

    if (val.isSolved) {
      const timeSpent = this.hud.stopTimer();
      this.sound.playVictory();

      // Salvar vitória e progresso
      this.storage.recordLevelCompletion(
        this.currentLevel.id,
        this.currentLevel.size,
        timeSpent,
        this.currentLevel.breed
      );

      // Exibir modal de vitória limpo
      setTimeout(() => {
        this.hud.showVictoryModal(this.currentLevel, timeSpent);
      }, 400);
    }
  }

  private registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.log('ServiceWorker registration optional:', err);
        });
      });
    }
  }
}

// Inicializar quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  new BorkdokuApp();
});
