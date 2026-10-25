import { createEmptyBoard, validateBoard, type BoardState, type CellCoord } from './engine/rules.js';
import { CURATED_LEVELS, getNextLevel, type LevelDefinition } from './engine/levels.js';
import { GameStorage } from './storage/db.js';
import { SoundManager } from './audio/sound.js';
import { BoardComponent, type InputMode } from './ui/board.js';
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
  private currentMode: InputMode = 'toggle';

  constructor() {
    this.storage = GameStorage.getInstance();
    this.sound = SoundManager.getInstance();

    // Iniciar na primeira fase ou na fase seguinte às já concluídas
    const completed = this.storage.getCompletedLevels();
    const lastLevelId = completed.length > 0 ? completed[completed.length - 1].levelId : 'level-1';
    this.currentLevel = CURATED_LEVELS.find(l => l.id === lastLevelId) || CURATED_LEVELS[0];

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
    boardContainer.className = 'w-full flex-1 flex flex-col items-center justify-center my-auto py-2';
    appEl.appendChild(boardContainer);

    // Inicializar HUD
    this.hud = new HudComponent(appEl, {
      onToggleSound: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.renderHeader(this.currentLevel, isMuted);
      },
      onReset: () => {
        this.board = createEmptyBoard(this.currentLevel.size);
        this.updateBoardAndValidate();
        this.sound.playRemove();
      },
      onOpenSettings: () => {
        this.settingsModal.show();
      },
      onNextLevel: () => {
        const next = getNextLevel(this.currentLevel.id);
        this.startLevel(next);
      },
      onSelectMode: (mode) => {
        this.currentMode = mode;
        this.hud.renderBottomControls(this.currentMode);
      }
    });

    // Inicializar Componente de Tabuleiro
    this.boardComponent = new BoardComponent(boardContainer, {
      onCellClick: (coord) => this.handleCellClick(coord)
    });

    // Inicializar Modal de Ajustes
    this.settingsModal = new SettingsModal({
      onThemeChanged: () => this.applyTheme(),
      onDataRestored: () => {
        this.applyTheme();
        this.startLevel(this.currentLevel);
      }
    });

    this.hud.renderBottomControls(this.currentMode);
  }

  startLevel(level: LevelDefinition) {
    this.currentLevel = level;
    this.board = createEmptyBoard(level.size);
    this.hud.renderHeader(this.currentLevel, this.sound.getMuted());
    this.hud.startTimer();
    this.updateBoardAndValidate();
  }

  handleCellClick(coord: CellCoord) {
    const current = this.board[coord.row][coord.col];

    if (this.currentMode === 'toggle') {
      if (current === 'empty') {
        this.board[coord.row][coord.col] = 'bone';
        this.sound.playBone();
      } else if (current === 'bone') {
        this.board[coord.row][coord.col] = 'dog';
        this.sound.playDog();
      } else {
        this.board[coord.row][coord.col] = 'empty';
        this.sound.playRemove();
      }
    } else if (this.currentMode === 'dog') {
      if (current === 'dog') {
        this.board[coord.row][coord.col] = 'empty';
        this.sound.playRemove();
      } else {
        this.board[coord.row][coord.col] = 'dog';
        this.sound.playDog();
      }
    } else if (this.currentMode === 'bone') {
      if (current === 'bone') {
        this.board[coord.row][coord.col] = 'empty';
        this.sound.playRemove();
      } else {
        this.board[coord.row][coord.col] = 'bone';
        this.sound.playBone();
      }
    }

    this.updateBoardAndValidate();
  }

  updateBoardAndValidate() {
    const val = validateBoard(this.board, this.currentLevel.regions);
    this.boardComponent.update(this.board, this.currentLevel.regions, val);

    if (val.conflicts.length > 0) {
      // Alerta sonoro suave apenas na primeira colisão
      this.sound.playConflict();
    }

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

      // Exibir modal de comemoração
      setTimeout(() => {
        this.hud.showVictoryModal(this.currentLevel, timeSpent);
      }, 400);
    }
  }

  private registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
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
