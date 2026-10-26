import test from 'node:test';
import assert from 'node:assert';
import { getLevel, getLevelById, getNextLevel, DIFFICULTY_TIERS, getTierForLevel, DOG_BREEDS } from './levels.js';
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

test('Geração progressiva por faixas de dificuldade calibrada', () => {
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

  const lvl700 = getLevel(700);
  assert.strictEqual(lvl700.size, 8);
  assert.strictEqual(lvl700.difficulty, 'Grão-Mestre');

  const lvl900 = getLevel(900);
  assert.strictEqual(lvl900.size, 8);
  assert.strictEqual(lvl900.difficulty, 'Lenda');
});

test('Nível 400 gera tabuleiro 8x8 Mestre com solução estritamente única', () => {
  const lvl400 = getLevelById('level-400');
  assert.strictEqual(lvl400.size, 8);
  assert.strictEqual(lvl400.difficulty, 'Mestre');

  // Validação matemática de unicidade
  const res = solvePuzzle(lvl400.regions, 2);
  assert.strictEqual(res.isUnique, true, 'Nível 400 deve ter exatamente 1 solução válida');
  assert.strictEqual(res.solutionsCount, 1);
});

test('Nível 700 gera tabuleiro 8x8 Grão-Mestre com solução estritamente única', () => {
  const lvl700 = getLevelById('level-700');
  assert.strictEqual(lvl700.size, 8);
  assert.strictEqual(lvl700.difficulty, 'Grão-Mestre');

  // Validação matemática de unicidade
  const res = solvePuzzle(lvl700.regions, 2);
  assert.strictEqual(res.isUnique, true, 'Nível 700 deve ter exatamente 1 solução válida');
  assert.strictEqual(res.solutionsCount, 1);
});

test('getNextLevel avança do 399 ao 400 e do 400 ao 401', () => {
  const next400 = getNextLevel('level-399');
  assert.strictEqual(next400.id, 'level-400');

  const next401 = getNextLevel('level-400');
  assert.strictEqual(next401.id, 'level-401');
});

test('Estrutura de Tiers de Dificuldade e Coleção de 40 Raças', () => {
  assert.strictEqual(DIFFICULTY_TIERS.length, 7);
  assert.strictEqual(DOG_BREEDS.length, 40);

  // Mapeamento correto de tiers
  const tierLvl5 = getTierForLevel(5);
  assert.strictEqual(tierLvl5.id, 'tier-1');
  assert.strictEqual(tierLvl5.name, 'Iniciante');
  assert.strictEqual(tierLvl5.difficulty, 'Fácil');

  const tierLvl20 = getTierForLevel(20);
  assert.strictEqual(tierLvl20.id, 'tier-2');
  assert.strictEqual(tierLvl20.name, 'Aprendiz');

  const tierLvl50 = getTierForLevel(50);
  assert.strictEqual(tierLvl50.id, 'tier-3');
  assert.strictEqual(tierLvl50.name, 'Intermediário');

  const tierLvl400 = getTierForLevel(400);
  assert.strictEqual(tierLvl400.id, 'tier-5');
  assert.strictEqual(tierLvl400.name, 'Mestre Avançado');

  const tierLvl700 = getTierForLevel(700);
  assert.strictEqual(tierLvl700.id, 'tier-6');
  assert.strictEqual(tierLvl700.name, 'Grão-Mestre');

  const tierLvl999 = getTierForLevel(999);
  assert.strictEqual(tierLvl999.id, 'tier-7');
  assert.strictEqual(tierLvl999.name, 'Lenda Canina');
});
