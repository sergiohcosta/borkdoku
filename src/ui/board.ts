import {
  type BoardState,
  type RegionMap,
  type CellCoord,
  type ValidationResult,
  cellKey
} from '../engine/rules.js';

export type InputMode = 'toggle' | 'dog' | 'bone';

export interface BoardOptions {
  onCellClick: (coord: CellCoord) => void;
}

export class BoardComponent {
  private container: HTMLElement;
  private size: number = 5;
  private regions: RegionMap = [];
  private board: BoardState = [];
  private validationResult: ValidationResult | null = null;
  private onCellClick: (coord: CellCoord) => void;

  constructor(container: HTMLElement, options: BoardOptions) {
    this.container = container;
    this.onCellClick = options.onCellClick;
  }

  update(board: BoardState, regions: RegionMap, validation: ValidationResult) {
    this.board = board;
    this.regions = regions;
    this.size = board.length;
    this.validationResult = validation;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const gridEl = document.createElement('div');
    gridEl.className = 'grid w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-[var(--grid-line)] bg-[var(--cell-empty)]';
    gridEl.style.display = 'grid';
    gridEl.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cellEl = document.createElement('div');
        const regId = this.regions[r][c];
        const state = this.board[r][c];
        const key = cellKey(r, c);
        const isConflict = this.validationResult?.conflictingCells.has(key) ?? false;

        // Classe base
        cellEl.className = 'cell';
        cellEl.style.backgroundColor = `var(--reg-${regId % 9})`;

        // Bordas de região
        // Superior
        if (r === 0 || this.regions[r - 1][c] !== regId) {
          cellEl.classList.add('border-t-region');
        }
        // Inferior
        if (r === this.size - 1 || this.regions[r + 1][c] !== regId) {
          cellEl.classList.add('border-b-region');
        }
        // Esquerda
        if (c === 0 || this.regions[r][c - 1] !== regId) {
          cellEl.classList.add('border-l-region');
        }
        // Direita
        if (c === this.size - 1 || this.regions[r][c + 1] !== regId) {
          cellEl.classList.add('border-r-region');
        }

        if (isConflict) {
          cellEl.classList.add('cell-error');
        }

        // Conteúdo da célula
        if (state === 'dog') {
          cellEl.innerHTML = `<span class="cell-pop text-2xl select-none" role="img" aria-label="Cachorrinho">🐶</span>`;
        } else if (state === 'bone') {
          cellEl.innerHTML = `<span class="text-xs opacity-60 select-none scale-75" role="img" aria-label="Ossinho">🦴</span>`;
        }

        // Evento de clique / toque
        cellEl.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.onCellClick({ row: r, col: c });
        });

        gridEl.appendChild(cellEl);
      }
    }

    this.container.appendChild(gridEl);
  }
}
