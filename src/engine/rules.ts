export interface CellCoord {
  row: number;
  col: number;
}

export type CellState = 'empty' | 'dog' | 'bone';

export type BoardState = CellState[][];
export type RegionMap = number[][];

export type ConflictType = 'row' | 'column' | 'region' | 'touch';

export interface Conflict {
  type: ConflictType;
  cells: CellCoord[];
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  isSolved: boolean;
  dogCount: number;
  targetCount: number;
  conflicts: Conflict[];
  conflictingCells: Set<string>; // 'row,col' para busca rápida O(1)
}

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function createEmptyBoard(size: number): BoardState {
  const board: BoardState = [];
  for (let r = 0; r < size; r++) {
    const row: CellState[] = [];
    for (let c = 0; c < size; c++) {
      row.push('empty');
    }
    board.push(row);
  }
  return board;
}

/**
 * Valida o estado atual do tabuleiro contra as 4 regras fundamentais:
 * 1. No máximo 1 cão por linha
 * 2. No máximo 1 cão por coluna
 * 3. No máximo 1 cão por região
 * 4. Nenhum cão pode tocar outro (nem diagonalmente nem ortogonalmente)
 */
export function validateBoard(board: BoardState, regions: RegionMap): ValidationResult {
  const size = board.length;
  const conflicts: Conflict[] = [];
  const conflictingCells = new Set<string>();

  // Encontrar todas as posições com cães
  const dogPositions: CellCoord[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'dog') {
        dogPositions.push({ row: r, col: c });
      }
    }
  }

  // 1. Regra de Linha
  const rowMap = new Map<number, CellCoord[]>();
  for (const pos of dogPositions) {
    if (!rowMap.has(pos.row)) rowMap.set(pos.row, []);
    rowMap.get(pos.row)!.push(pos);
  }
  for (const [row, positions] of rowMap.entries()) {
    if (positions.length > 1) {
      conflicts.push({
        type: 'row',
        cells: positions,
        message: `Mais de um cachorrinho na linha ${row + 1}`
      });
      for (const p of positions) conflictingCells.add(cellKey(p.row, p.col));
    }
  }

  // 2. Regra de Coluna
  const colMap = new Map<number, CellCoord[]>();
  for (const pos of dogPositions) {
    if (!colMap.has(pos.col)) colMap.set(pos.col, []);
    colMap.get(pos.col)!.push(pos);
  }
  for (const [col, positions] of colMap.entries()) {
    if (positions.length > 1) {
      conflicts.push({
        type: 'column',
        cells: positions,
        message: `Mais de um cachorrinho na coluna ${col + 1}`
      });
      for (const p of positions) conflictingCells.add(cellKey(p.row, p.col));
    }
  }

  // 3. Regra de Região
  const regMap = new Map<number, CellCoord[]>();
  for (const pos of dogPositions) {
    const regId = regions[pos.row][pos.col];
    if (!regMap.has(regId)) regMap.set(regId, []);
    regMap.get(regId)!.push(pos);
  }
  for (const [, positions] of regMap.entries()) {
    if (positions.length > 1) {
      conflicts.push({
        type: 'region',
        cells: positions,
        message: `Mais de um cachorrinho na mesma região colorida`
      });
      for (const p of positions) conflictingCells.add(cellKey(p.row, p.col));
    }
  }

  // 4. Regra de Espaço Pessoal (Adjacência ortogonal e diagonal)
  for (let i = 0; i < dogPositions.length; i++) {
    for (let j = i + 1; j < dogPositions.length; j++) {
      const p1 = dogPositions[i];
      const p2 = dogPositions[j];
      const rowDiff = Math.abs(p1.row - p2.row);
      const colDiff = Math.abs(p1.col - p2.col);

      // Células vizinhas (distância Chebyshev == 1)
      if (rowDiff <= 1 && colDiff <= 1) {
        conflicts.push({
          type: 'touch',
          cells: [p1, p2],
          message: `Cachorrinhos precisam de espaço pessoal e não podem se tocar!`
        });
        conflictingCells.add(cellKey(p1.row, p1.col));
        conflictingCells.add(cellKey(p2.row, p2.col));
      }
    }
  }

  const isValid = conflicts.length === 0;
  const isSolved = isValid && dogPositions.length === size;

  return {
    isValid,
    isSolved,
    dogCount: dogPositions.length,
    targetCount: size,
    conflicts,
    conflictingCells
  };
}
