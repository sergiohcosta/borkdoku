import test from 'node:test';
import assert from 'node:assert/strict';
import { solvePuzzle, hasUniqueSolution } from './solver.js';
import { type RegionMap } from './rules.js';

test('Solver encontra solução única em tabuleiro 5x5', () => {
  const regions: RegionMap = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 1, 2],
    [0, 3, 0, 1, 2],
    [0, 0, 4, 4, 4]
  ];

  const res = solvePuzzle(regions, 2);
  assert.equal(res.solutionsCount, 1);
  assert.equal(res.isUnique, true);
  assert.notEqual(res.solution, null);
  assert.equal(res.solution?.length, 5);

  // Verificar posições exatas esperadas
  const cols = res.solution!.map(s => s.col);
  assert.deepEqual(cols, [0, 2, 4, 1, 3]);
});

test('Solver detecta tabuleiro sem solução', () => {
  // Região 0 isolada em um canto onde nenhuma peça pode ser colocada sem tocar
  const impossibleRegions: RegionMap = [
    [0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [2, 2, 3, 3, 1],
    [2, 3, 3, 4, 4],
    [2, 3, 4, 4, 4]
  ];

  const res = solvePuzzle(impossibleRegions, 2);
  assert.equal(res.solutionsCount, 0);
  assert.equal(res.isUnique, false);
  assert.equal(res.solution, null);
});

test('hasUniqueSolution retorna true apenas para unicidade estrita', () => {
  const uniqueRegions: RegionMap = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 1, 2],
    [0, 3, 0, 1, 2],
    [0, 0, 4, 4, 4]
  ];

  assert.equal(hasUniqueSolution(uniqueRegions), true);
});
