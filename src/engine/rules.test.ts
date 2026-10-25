import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyBoard, validateBoard, type RegionMap } from './rules.js';

test('Board vazio deve ser válido mas não resolvido', () => {
  const board = createEmptyBoard(5);
  const regions: RegionMap = [
    [0, 0, 1, 1, 1],
    [0, 0, 1, 2, 2],
    [0, 3, 3, 2, 2],
    [4, 4, 3, 3, 2],
    [4, 4, 4, 4, 2]
  ];

  const res = validateBoard(board, regions);
  assert.equal(res.isValid, true);
  assert.equal(res.isSolved, false);
  assert.equal(res.dogCount, 0);
  assert.equal(res.conflicts.length, 0);
});

test('Detecção de conflito na mesma linha', () => {
  const board = createEmptyBoard(5);
  board[0][0] = 'dog';
  board[0][4] = 'dog'; // Mesma linha 0
  const regions: RegionMap = [
    [0, 0, 1, 1, 1],
    [0, 0, 1, 2, 2],
    [0, 3, 3, 2, 2],
    [4, 4, 3, 3, 2],
    [4, 4, 4, 4, 2]
  ];

  const res = validateBoard(board, regions);
  assert.equal(res.isValid, false);
  assert.equal(res.conflicts.some(c => c.type === 'row'), true);
});

test('Detecção de conflito na mesma coluna', () => {
  const board = createEmptyBoard(5);
  board[0][2] = 'dog';
  board[4][2] = 'dog'; // Mesma coluna 2
  const regions: RegionMap = [
    [0, 0, 1, 1, 1],
    [0, 0, 1, 2, 2],
    [0, 3, 3, 2, 2],
    [4, 4, 3, 3, 2],
    [4, 4, 4, 4, 2]
  ];

  const res = validateBoard(board, regions);
  assert.equal(res.isValid, false);
  assert.equal(res.conflicts.some(c => c.type === 'column'), true);
});

test('Detecção de conflito na mesma região colorida', () => {
  const board = createEmptyBoard(5);
  // Ambas as células na região 4 (última linha)
  board[3][0] = 'dog';
  board[4][4] = 'dog'; // Ambos têm região 4
  const regions: RegionMap = [
    [0, 0, 1, 1, 1],
    [0, 0, 1, 2, 2],
    [0, 3, 3, 2, 2],
    [4, 4, 3, 3, 2],
    [4, 4, 4, 4, 4]
  ];

  const res = validateBoard(board, regions);
  assert.equal(res.isValid, false);
  assert.equal(res.conflicts.some(c => c.type === 'region'), true);
});

test('Detecção de conflito de toque diagonal (espaço pessoal)', () => {
  const board = createEmptyBoard(5);
  board[1][1] = 'dog';
  board[2][2] = 'dog'; // Toca na diagonal!
  const regions: RegionMap = [
    [0, 0, 1, 1, 1],
    [0, 0, 1, 2, 2],
    [3, 3, 4, 2, 2],
    [3, 3, 4, 4, 2],
    [3, 3, 4, 4, 4]
  ];

  const res = validateBoard(board, regions);
  assert.equal(res.isValid, false);
  assert.equal(res.conflicts.some(c => c.type === 'touch'), true);
});

test('Validação de solução completa e perfeita de 5x5', () => {
  const board = createEmptyBoard(5);
  // Solução válida clássica sem toques e 1 por linha/coluna/região
  // (0,1), (1,3), (2,0), (3,2), (4,4)
  board[0][1] = 'dog';
  board[1][3] = 'dog';
  board[2][0] = 'dog';
  board[3][2] = 'dog';
  board[4][4] = 'dog';

  // Regiões mapeadas precisamente para conter cada cão
  const regions: RegionMap = [
    [0, 0, 0, 1, 1],
    [2, 0, 1, 1, 1],
    [2, 2, 3, 3, 1],
    [2, 3, 3, 4, 4],
    [2, 3, 4, 4, 4]
  ];

  const res = validateBoard(board, regions);
  assert.equal(res.isValid, true);
  assert.equal(res.isSolved, true);
  assert.equal(res.dogCount, 5);
  assert.equal(res.conflicts.length, 0);
});
