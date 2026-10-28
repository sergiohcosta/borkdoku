import test from 'node:test';
import assert from 'node:assert';
import { TelemetryService, getDurationBucket, getTimeToFirstDogBucket } from './telemetry.js';
import { GameStorage } from '../storage/db.js';

test('Faixas de duração (buckets) agrupam corretamente', () => {
  assert.strictEqual(getDurationBucket(15), '<30s');
  assert.strictEqual(getDurationBucket(45), '30s-1m');
  assert.strictEqual(getDurationBucket(90), '1m-2m');
  assert.strictEqual(getDurationBucket(150), '2m-3m');
  assert.strictEqual(getDurationBucket(240), '3m-5m');
  assert.strictEqual(getDurationBucket(400), '>5m');
});

test('Faixas de tempo até o 1º cão (âncora) agrupam corretamente', () => {
  assert.strictEqual(getTimeToFirstDogBucket(5), '<10s');
  assert.strictEqual(getTimeToFirstDogBucket(20), '10-30s');
  assert.strictEqual(getTimeToFirstDogBucket(45), '30-60s');
  assert.strictEqual(getTimeToFirstDogBucket(90), '>60s');
});

test('TelemetryService respeita a opção de opt-out do usuário', () => {
  const storage = GameStorage.getInstance();
  const telemetry = TelemetryService.getInstance();
  const captured: { path: string; title: string }[] = [];

  telemetry.setCustomSender((path, title) => {
    captured.push({ path, title });
  });

  // Usuário desativa telemetria
  storage.saveSettings({ telemetryEnabled: false });

  telemetry.startLevel(1, 5, 'Fácil');
  telemetry.recordWin(25, true, 3);

  // Nenhum evento deve ter sido enviado
  assert.strictEqual(captured.length, 0);

  // Reativa para os próximos testes
  storage.saveSettings({ telemetryEnabled: true });
});

test('TelemetryService registra ciclo de jogo completo (Início -> 1º cão -> Dica -> Vitória)', () => {
  const storage = GameStorage.getInstance();
  storage.saveSettings({ telemetryEnabled: true });

  const telemetry = TelemetryService.getInstance();
  const captured: { path: string; title: string }[] = [];

  telemetry.setCustomSender((path, title) => {
    captured.push({ path, title });
  });

  telemetry.startLevel(15, 6, 'Médio');
  telemetry.recordFirstDogPlaced();
  telemetry.recordHint('guide-dog');
  telemetry.recordWin(75, false, 2);

  assert.ok(captured.length >= 2);
  // Deve conter evento de dica
  assert.ok(captured.some(c => c.path === 'game/hint/15/guide-dog'));
  // Deve conter evento de vitória com faixa de tempo e tipo dica
  assert.ok(captured.some(c => c.path === 'game/win/15/dica/1m-2m'));
});

test('TelemetryService registra Game Over e abandono de fase', () => {
  const storage = GameStorage.getInstance();
  storage.saveSettings({ telemetryEnabled: true });

  const telemetry = TelemetryService.getInstance();
  const captured: { path: string; title: string }[] = [];

  telemetry.setCustomSender((path, title) => {
    captured.push({ path, title });
  });

  // Fase 10 com Game Over por toque diagonal
  telemetry.startLevel(10, 5, 'Fácil');
  telemetry.recordGameOver('diagonal');
  assert.ok(captured.some(c => c.path === 'game/over/10/diagonal'));

  // Inicia Fase 11 mas troca para 12 sem terminar -> gera abandono da 11
  telemetry.startLevel(11, 5, 'Fácil');
  telemetry.startLevel(12, 5, 'Fácil');
  assert.ok(captured.some(c => c.path === 'game/abandon/11'));
});

test('TelemetryService registra eventos de produto e preferências', () => {
  const storage = GameStorage.getInstance();
  storage.saveSettings({ telemetryEnabled: true });

  const telemetry = TelemetryService.getInstance();
  const captured: { path: string; title: string }[] = [];

  telemetry.setCustomSender((path, title) => {
    captured.push({ path, title });
  });

  telemetry.recordFeature('album_opened');
  telemetry.recordFeature('github_star_clicked', 'victory_modal');
  telemetry.recordEnvironment('dark', false);

  assert.ok(captured.some(c => c.path === 'feature/album_opened'));
  assert.ok(captured.some(c => c.path === 'feature/github_star_clicked/victory_modal'));
  assert.ok(captured.some(c => c.path === 'env/theme/dark'));
  assert.ok(captured.some(c => c.path === 'env/device/desktop'));
});
