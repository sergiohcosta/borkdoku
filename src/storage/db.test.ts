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

test('Configurações do jogador e toggle de telemetria anônima', () => {
  const storage = GameStorage.getInstance();
  storage.clearAll();

  // Padrão: telemetria ativa
  const defaults = storage.getSettings();
  assert.equal(defaults.telemetryEnabled, true);

  // Desativar telemetria
  storage.saveSettings({ telemetryEnabled: false });
  assert.equal(storage.getSettings().telemetryEnabled, false);

  // Reativar telemetria
  storage.saveSettings({ telemetryEnabled: true });
  assert.equal(storage.getSettings().telemetryEnabled, true);
});

test('Persistência do nível atual do jogador', () => {
  const storage = GameStorage.getInstance();
  storage.clearAll();
  assert.equal(storage.getCurrentLevelId(), 'level-1');

  storage.setCurrentLevelId('level-4');
  assert.equal(storage.getCurrentLevelId(), 'level-4');
});

test('Rastreamento de fases concluídas e contagem por faixas de dificuldade', () => {
  const storage = GameStorage.getInstance();
  storage.clearAll();

  // Sem conclusões inicialmente
  assert.equal(storage.getCompletedLevelsCount(), 0);
  assert.equal(storage.isLevelCompleted(1), false);

  // Completar níveis 1, 2 e 5 (Tier 1: 1 a 12)
  storage.recordLevelCompletion('level-1', 5, 20, 'Golden Retriever');
  storage.recordLevelCompletion('level-2', 5, 25, 'Pug Travesso');
  storage.recordLevelCompletion('level-5', 5, 30, 'Husky Siberiano');

  // Completar nível 15 (Tier 2: 13 a 35)
  storage.recordLevelCompletion('level-15', 6, 60, 'Dálmata Pintado');

  assert.equal(storage.getCompletedLevelsCount(), 4);
  assert.equal(storage.isLevelCompleted(1), true);
  assert.equal(storage.isLevelCompleted(2), true);
  assert.equal(storage.isLevelCompleted(5), true);
  assert.equal(storage.isLevelCompleted(15), true);
  assert.equal(storage.isLevelCompleted(3), false);

  // Contagem por tier
  assert.equal(storage.getCompletedCountInTier(1, 12), 3);
  assert.equal(storage.getCompletedCountInTier(13, 35), 1);
  assert.equal(storage.getCompletedCountInTier(36, 80), 0);

  // Maior nível alcançado
  assert.equal(storage.getHighestLevelReached(), 15);

  // Recentes
  const recent = storage.getRecentCompletedLevels(2);
  assert.equal(recent.length, 2);
  assert.equal(recent[0].levelId, 'level-15');
});

test('Rastreamento do Selo Faro Puro e promoção ao rejogar sem dicas', () => {
  const storage = GameStorage.getInstance();
  storage.clearAll();

  // Nível 1 vencido COM uso de dicas (cleanClear = false)
  storage.recordLevelCompletion('level-1', 5, 40, 'Golden Retriever', false);
  assert.equal(storage.getCleanClearCount(), 0);
  assert.equal(storage.isLevelCleanCleared(1), false);

  // Nível 2 vencido SEM uso de dicas (cleanClear = true)
  storage.recordLevelCompletion('level-2', 5, 25, 'Pug Travesso', true);
  assert.equal(storage.getCleanClearCount(), 1);
  assert.equal(storage.isLevelCleanCleared(2), true);

  // Jogador rejoga Nível 1 e desta vez vence SEM dicas!
  storage.recordLevelCompletion('level-1', 5, 18, 'Golden Retriever', true);
  assert.equal(storage.getCleanClearCount(), 2);
  assert.equal(storage.isLevelCleanCleared(1), true);

  // Se rejogar de novo com dicas, o selo conquistado NÃO se perde
  storage.recordLevelCompletion('level-1', 5, 50, 'Golden Retriever', false);
  assert.equal(storage.isLevelCleanCleared(1), true);
  assert.equal(storage.getCleanClearCount(), 2);
});
