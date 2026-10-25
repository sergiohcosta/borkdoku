import test from 'node:test';
import assert from 'node:assert';
import { getLevel, getLevelById, getNextLevel } from './levels.js';
import { solvePuzzle } from './solver.js';

test('Níveis curados iniciais 1 a 8 estão intactos', () => {
  const lvl1 = getLevel(1);
  assert.strictEqual(lvl1.id, 'level-1');
  assert.strictEqual(lvl1.size, 5);
  assert.strictEqual(lvl1.breed, 'Golden Retriever');

  const lvl8 = getLevel(8);
  assert.strictEqual(lvl8.id, 'level-8');
  assert.strictEqual(lvl8.size, 8);
  assert.strictEqual(lvl8.breed, 'São Bernardo Guardião');
});

test('Geração progressiva por faixas de dificuldade (estilo Meowdoku)', () => {
  const lvl9 = getLevel(9);
  assert.strictEqual(lvl9.size, 5);
  assert.strictEqual(lvl9.difficulty, 'Fácil');

  const lvl15 = getLevel(15);
  assert.strictEqual(lvl15.size, 6);
  assert.strictEqual(lvl15.difficulty, 'Médio');

  const lvl40 = getLevel(40);
  assert.strictEqual(lvl40.size, 7);
  assert.strictEqual(lvl40.difficulty, 'Difícil');

  const lvl100 = getLevel(100);
  assert.strictEqual(lvl100.size, 8);
  assert.strictEqual(lvl100.difficulty, 'Mestre');
});

test('Nível 400 gera tabuleiro 8x8 com solução estritamente única', () => {
  const lvl400 = getLevelById('level-400');
  assert.strictEqual(lvl400.size, 8);
  assert.strictEqual(lvl400.difficulty, 'Mestre');

  // Validação matemática de unicidade
  const res = solvePuzzle(lvl400.regions, 2);
  assert.strictEqual(res.isUnique, true, 'Nível 400 deve ter exatamente 1 solução válida');
  assert.strictEqual(res.solutionsCount, 1);
});

test('getNextLevel avança do 399 ao 400 e do 400 ao 401', () => {
  const next400 = getNextLevel('level-399');
  assert.strictEqual(next400.id, 'level-400');

  const next401 = getNextLevel('level-400');
  assert.strictEqual(next401.id, 'level-401');
});
