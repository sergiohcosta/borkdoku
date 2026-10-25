import { type CellCoord, type RegionMap } from './rules.js';

export interface SolverResult {
  solutionsCount: number;
  isUnique: boolean;
  solution: CellCoord[] | null;
}

/**
 * Resolvedor determinístico com backtracking e poda para o quebra-cabeça Queens/Borkdoku.
 * Explora linha por linha e verifica conflitos com bitmasks e checagens rápidas de adjacência.
 */
export function solvePuzzle(regions: RegionMap, maxSolutions: number = 2): SolverResult {
  const size = regions.length;
  const solutions: CellCoord[][] = [];

  const usedCols = new Array(size).fill(false);
  const usedRegions = new Array(size).fill(false);
  const currentPlacement: number[] = new Array(size).fill(-1); // placement[row] = col

  function backtrack(row: number) {
    if (solutions.length >= maxSolutions) return;

    if (row === size) {
      // Solução encontrada
      const sol: CellCoord[] = [];
      for (let r = 0; r < size; r++) {
        sol.push({ row: r, col: currentPlacement[r] });
      }
      solutions.push(sol);
      return;
    }

    for (let col = 0; col < size; col++) {
      if (usedCols[col]) continue;

      const regId = regions[row][col];
      if (usedRegions[regId]) continue;

      // Checar se toca a peça da linha anterior (ortogonal ou diagonal)
      if (row > 0) {
        const prevCol = currentPlacement[row - 1];
        if (Math.abs(prevCol - col) <= 1) {
          continue; // Toque ortogonal ou diagonal proibido
        }
      }

      // Marcar e avançar
      usedCols[col] = true;
      usedRegions[regId] = true;
      currentPlacement[row] = col;

      backtrack(row + 1);

      // Desfazer
      usedCols[col] = false;
      usedRegions[regId] = false;
      currentPlacement[row] = -1;
    }
  }

  backtrack(0);

  return {
    solutionsCount: solutions.length,
    isUnique: solutions.length === 1,
    solution: solutions.length > 0 ? solutions[0] : null
  };
}

/**
 * Validador booleano rápido de unicidade.
 */
export function hasUniqueSolution(regions: RegionMap): boolean {
  const result = solvePuzzle(regions, 2);
  return result.isUnique;
}
