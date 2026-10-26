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
  onCellDragPlaceBone: (coord: CellCoord) => void;
}

function renderBoneSvg(isLocked: boolean = false): string {
  const lockedClass = isLocked ? 'bone-icon-locked' : '';
  return `<svg class="bone-icon ${lockedClass} select-none" viewBox="0 0 32 32" aria-label="${isLocked ? 'Ossinho fixo' : 'Ossinho'}"><path class="bone-path" d="M7 11.5 C5.6 11.5 4.5 12.6 4.5 14 C4.5 14.6 4.7 15.1 5 15.5 C4.7 15.9 4.5 16.4 4.5 17 C4.5 18.4 5.6 19.5 7 19.5 C8.1 19.5 9 18.8 9.3 17.8 L22.7 17.8 C23 18.8 23.9 19.5 25 19.5 C26.4 19.5 27.5 18.4 27.5 17 C27.5 16.4 27.3 15.9 27 15.5 C27.3 15.1 27.5 14.6 27.5 14 C27.5 12.6 26.4 11.5 25 11.5 C23.9 11.5 23 12.2 22.7 13.2 L9.3 13.2 C9 12.2 8.1 11.5 7 11.5 Z" /></svg>`;
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
  private onCellDragPlaceBone: (coord: CellCoord) => void;

  // Gerenciamento de clique simples vs duplo
  private clickTimer: number | null = null;
  private lastClickedCoord: CellCoord | null = null;

  // Gerenciamento de arrasto contínuo (drag-to-bone)
  private isPointerDown: boolean = false;
  private hasDragged: boolean = false;
  private dragStartCoord: CellCoord | null = null;
  private draggedKeys: Set<string> = new Set();
  private startX: number = 0;
  private startY: number = 0;

  constructor(container: HTMLElement, options: BoardOptions) {
    this.container = container;
    this.onCellSingleClick = options.onCellSingleClick;
    this.onCellDoubleClick = options.onCellDoubleClick;
    this.onCellDragPlaceBone = options.onCellDragPlaceBone;

    // Escuta movimentos e término do ponteiro em nível de janela para capturar qualquer arrasto suave
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
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

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.isPointerDown || !this.dragStartCoord) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const distSq = dx * dx + dy * dy;

    // Se moveu mais que 8px, entra em modo de arrasto contínuo de ossinhos
    if (distSq >= 64 || this.hasDragged) {
      if (!this.hasDragged) {
        this.hasDragged = true;
        // Cancela qualquer timer de clique pendente
        if (this.clickTimer !== null) {
          window.clearTimeout(this.clickTimer);
          this.clickTimer = null;
          this.lastClickedCoord = null;
        }

        // Coloca ossinho na célula inicial se ainda não marcou
        const startKey = cellKey(this.dragStartCoord.row, this.dragStartCoord.col);
        if (!this.draggedKeys.has(startKey)) {
          this.draggedKeys.add(startKey);
          this.onCellDragPlaceBone(this.dragStartCoord);
        }
      }

      // Identifica a célula sobre a qual o ponteiro está passando
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hitCell = el?.closest('.cell') as HTMLElement | null;
      if (hitCell && hitCell.dataset.row !== undefined && hitCell.dataset.col !== undefined) {
        const row = parseInt(hitCell.dataset.row, 10);
        const col = parseInt(hitCell.dataset.col, 10);
        const key = cellKey(row, col);

        if (!this.draggedKeys.has(key)) {
          this.draggedKeys.add(key);
          this.onCellDragPlaceBone({ row, col });
        }
      }
    }
  };

  private handlePointerUp = (_e: PointerEvent) => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    if (this.hasDragged) {
      // Finalizou o arrasto de ossinhos com sucesso (não dispara cliques normais)
      this.hasDragged = false;
      this.dragStartCoord = null;
      this.draggedKeys.clear();
      return;
    }

    const coord = this.dragStartCoord;
    this.dragStartCoord = null;
    this.draggedKeys.clear();
    if (!coord) return;

    const key = cellKey(coord.row, coord.col);
    if (this.lockedCells.has(key)) return;

    if (this.clickTimer !== null && this.lastClickedCoord &&
        this.lastClickedCoord.row === coord.row && this.lastClickedCoord.col === coord.col) {
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
  };

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
        cellEl.dataset.row = r.toString();
        cellEl.dataset.col = c.toString();
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
          cellEl.innerHTML = renderBoneSvg(true);
        } else if (state === 'dog') {
          cellEl.innerHTML = `<span class="cell-pop text-2xl select-none" role="img" aria-label="Cachorrinho">🐶</span>`;
        } else if (state === 'bone') {
          cellEl.innerHTML = renderBoneSvg(false);
        }

        // Início do toque/clique com suporte a arrasto
        cellEl.addEventListener('pointerdown', (e: PointerEvent) => {
          e.preventDefault();
          if (isLocked) return;

          this.isPointerDown = true;
          this.hasDragged = false;
          this.startX = e.clientX;
          this.startY = e.clientY;
          this.dragStartCoord = { row: r, col: c };
          this.draggedKeys.clear();
        });

        gridEl.appendChild(cellEl);
      }
    }

    this.container.appendChild(gridEl);
  }
}
