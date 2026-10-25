import test from 'node:test';
import assert from 'node:assert/strict';
import { GameStorage } from './db.js';

// Polyfill localStorage in node test environment
if (typeof localStorage === 'undefined') {
  const store: Record<string, string> = {};
  global.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    length: 0,
    key: () => null
  };
}

test('Storage salva e recupera estatísticas e raças', () => {
  const storage = GameStorage.getInstance();
  storage.clearAll();

  const initialStats = storage.getStats();
  assert.equal(initialStats.gamesPlayed, 0);

  // Registrar vitória na fase 1
  storage.recordLevelCompletion('level-1', 5, 45, 'Pug Travesso');

  const updatedStats = storage.getStats();
  assert.equal(updatedStats.gamesPlayed, 1);
  assert.equal(updatedStats.gamesWon, 1);
  assert.equal(updatedStats.currentStreak, 1);
  assert.equal(updatedStats.bestTimesBySize[5], 45);

  const breeds = storage.getUnlockedBreeds();
  assert.equal(breeds.includes('Pug Travesso'), true);
});

test('Backup e restauração recuperam dados perfeitamente', () => {
  const storage = GameStorage.getInstance();
  storage.clearAll();

  storage.recordLevelCompletion('level-1', 5, 30, 'Corgi');
  const backupJson = storage.generateBackupJSON();

  // Limpar dados
  storage.clearAll();
  assert.equal(storage.getCompletedLevels().length, 0);

  // Restaurar
  const res = storage.restoreBackup(backupJson);
  assert.equal(res.success, true);
  assert.equal(storage.getCompletedLevels().length, 1);
  assert.equal(storage.getStats().gamesWon, 1);
});

test('Restauração rejeita arquivo corrompido ou com versão errada', () => {
  const storage = GameStorage.getInstance();
  const invalidJson = JSON.stringify({ schemaVersion: '99.0' });
  const res = storage.restoreBackup(invalidJson);
  assert.equal(res.success, false);
});

test('Persistência do nível atual do jogador', () => {
  const storage = GameStorage.getInstance();
  storage.clearAll();
  assert.equal(storage.getCurrentLevelId(), 'level-1');

  storage.setCurrentLevelId('level-4');
  assert.equal(storage.getCurrentLevelId(), 'level-4');
});
