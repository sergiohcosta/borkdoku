import {
  type BoardState,
  type RegionMap,
  type CellCoord,
  type ValidationResult,
  cellKey
} from '../engine/rules.js';

export interface BoardOptions {
  onCellSingleClick: (coord: CellCoord) => void;
  onCellDoubleClick: (coord: CellCoord) => void;
}

export class BoardComponent {
  private container: HTMLElement;
  private size: number = 5;
  private regions: RegionMap = [];
  private board: BoardState = [];
  private validationResult: ValidationResult | null = null;
  private lockedCells: Set<string> = new Set();
  private onCellSingleClick: (coord: CellCoord) => void;
  private onCellDoubleClick: (coord: CellCoord) => void;

  private clickTimer: number | null = null;
  private lastClickedCoord: CellCoord | null = null;

  constructor(container: HTMLElement, options: BoardOptions) {
    this.container = container;
    this.onCellSingleClick = options.onCellSingleClick;
    this.onCellDoubleClick = options.onCellDoubleClick;
  }

  update(board: BoardState, regions: RegionMap, validation: ValidationResult, lockedCells: Set<string> = new Set()) {
    this.board = board;
    this.regions = regions;
    this.size = board.length;
    this.validationResult = validation;
    this.lockedCells = lockedCells;
    this.render();
  }

  flashErrorCell(coord: CellCoord) {
    const key = `cell-${coord.row}-${coord.col}`;
    const el = document.getElementById(key);
    if (el) {
      el.classList.add('cell-error');
      setTimeout(() => {
        el.classList.remove('cell-error');
      }, 500);
    }
  }

  render() {
    this.container.innerHTML = '';

    const gridEl = document.createElement('div');
    gridEl.className = 'board-grid';
    gridEl.style.display = 'grid';
    gridEl.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cellEl = document.createElement('div');
        cellEl.id = `cell-${r}-${c}`;
        const regId = this.regions[r][c];
        const state = this.board[r][c];
        const key = cellKey(r, c);
        const isLocked = this.lockedCells.has(key);
        const isConflict = this.validationResult?.conflictingCells.has(key) ?? false;

        // Classe base
        cellEl.className = 'cell';
        cellEl.style.backgroundColor = `var(--reg-${regId % 9})`;
        if (isLocked) {
          cellEl.classList.add('cell-locked');
        }

        // Bordas de região
        if (r === 0 || this.regions[r - 1][c] !== regId) {
          cellEl.classList.add('border-t-region');
        }
        if (r === this.size - 1 || this.regions[r + 1][c] !== regId) {
          cellEl.classList.add('border-b-region');
        }
        if (c === 0 || this.regions[r][c - 1] !== regId) {
          cellEl.classList.add('border-l-region');
        }
        if (c === this.size - 1 || this.regions[r][c + 1] !== regId) {
          cellEl.classList.add('border-r-region');
        }

        if (isConflict) {
          cellEl.classList.add('cell-error');
        }

        // Conteúdo da célula
        if (isLocked) {
          cellEl.innerHTML = `<span class="text-xs opacity-60 select-none scale-90" role="img" aria-label="Ossinho bloqueado">🦴</span>`;
        } else if (state === 'dog') {
          cellEl.innerHTML = `<span class="cell-pop text-2xl select-none" role="img" aria-label="Cachorrinho">🐶</span>`;
        } else if (state === 'bone') {
          cellEl.innerHTML = `<span class="text-xs opacity-70 select-none scale-90" role="img" aria-label="Ossinho">🦴</span>`;
        }

        // Evento de toque com detecção de clique simples vs duplo
        cellEl.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (isLocked) return; // Não permite clicar em casa já travada!
          const coord = { row: r, col: c };

          if (this.clickTimer !== null && this.lastClickedCoord &&
              this.lastClickedCoord.row === r && this.lastClickedCoord.col === c) {
            // Duplo clique imediato
            window.clearTimeout(this.clickTimer);
            this.clickTimer = null;
            this.lastClickedCoord = null;
            this.onCellDoubleClick(coord);
          } else {
            // Primeiro clique: aguarda 220ms
            if (this.clickTimer !== null) {
              window.clearTimeout(this.clickTimer);
              if (this.lastClickedCoord) {
                this.onCellSingleClick(this.lastClickedCoord);
              }
            }
            this.lastClickedCoord = coord;
            this.clickTimer = window.setTimeout(() => {
              this.clickTimer = null;
              const target = this.lastClickedCoord;
              this.lastClickedCoord = null;
              if (target) {
                this.onCellSingleClick(target);
              }
            }, 220);
          }
        });

        gridEl.appendChild(cellEl);
      }
    }

    this.container.appendChild(gridEl);
  }
}
