import test from 'node:test';
import assert from 'node:assert';
import { getHint } from './hint.js';
import { getLevel } from './levels.js';
import { createEmptyBoard } from './rules.js';

test('Dica em tabuleiro vazio sugere uma casa válida de cão', () => {
  const lvl1 = getLevel(1);
  const board = createEmptyBoard(lvl1.size);

  const hint = getHint(board, lvl1);
  assert.strictEqual(hint.type, 'guide-dog');
  assert.ok(hint.coord);
  // O cão sugerido deve bater com a solução do nível naquela linha
  assert.strictEqual(lvl1.solution[hint.coord.row], hint.coord.col);
  assert.match(hint.message, /Faro aguçado/);
});

test('Dica detecta ossinho colocado onde deveria ir um cão (Farejar Erro)', () => {
  const lvl1 = getLevel(1);
  const board = createEmptyBoard(lvl1.size);

  // Solução da linha 0 é coluna lvl1.solution[0] = 0
  board[0][lvl1.solution[0]] = 'bone';

  const hint = getHint(board, lvl1);
  assert.strictEqual(hint.type, 'error-bone');
  assert.deepStrictEqual(hint.coord, { row: 0, col: lvl1.solution[0] });
  assert.match(hint.message, /há um ossinho no lugar de um cachorrinho/);
});

test('Dica prioriza linha com apenas 1 casa livre restante', () => {
  const lvl1 = getLevel(1); // 5x5
  const board = createEmptyBoard(lvl1.size);

  // Na linha 2, sol é lvl1.solution[2]. Preenchemos todas as outras 4 colunas com 'bone'
  const targetCol = lvl1.solution[2];
  for (let c = 0; c < lvl1.size; c++) {
    if (c !== targetCol) {
      board[2][c] = 'bone';
    }
  }

  const hint = getHint(board, lvl1);
  assert.strictEqual(hint.type, 'guide-dog');
  assert.deepStrictEqual(hint.coord, { row: 2, col: targetCol });
});

test('Dica em tabuleiro completo informa que já está resolvido', () => {
  const lvl1 = getLevel(1);
  const board = createEmptyBoard(lvl1.size);

  // Coloca a solução exata
  for (let r = 0; r < lvl1.size; r++) {
    board[r][lvl1.solution[r]] = 'dog';
  }

  const hint = getHint(board, lvl1);
  assert.strictEqual(hint.type, 'already-solved');
  assert.match(hint.message, /cantinho já está perfeito/);
});
