# Actions: Borkdoku Core MVP

> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  
> Roadmap: `_reversa_forward/001-borkdoku-core-mvp/roadmap.md`  

## Resumo

| Métrica | Valor |
|---|---|
| Total de ações | 15 |
| Paralelizáveis (`[//]`) | 7 |
| Maior cadeia de dependência | 5 (T001 → T005 → T006 → T010 → T013) |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|---|---|---|---|---|---|---|
| T001 | Inicializar `package.json`, `tsconfig.json` e `vite.config.ts` com dependências mínimas para compilação TypeScript moderna. | - | `[//]` | `package.json` | 🟢 | `[X]` |
| T002 | Criar estrutura `index.html` com meta tags mobile-first (`viewport-fit=cover`, `touch-action`), link do manifest e favicon SVG. | - | `[//]` | `index.html` | 🟢 | `[X]` |
| T003 | Configurar estilos base CSS e paleta de cores aconchegante (*cozy*) para as regiões do tabuleiro e tema claro/escuro. | T002 | - | `src/styles.css` | 🟡 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|---|---|---|---|---|---|---|
| T004 | Escrever bateria de testes unitários para validação das 4 regras do tabuleiro (linha, coluna, região e diagonal) e checagem de vitória. | T001 | `[//]` | `src/engine/rules.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|---|---|---|---|---|---|---|
| T005 | Implementar modelo de dados da grade e validador de regras puras (`RuleValidator`) reportando conflitos com latência < 15ms. | T001 | - | `src/engine/rules.ts` | 🟢 | `[X]` |
| T006 | Implementar resolvedor com algoritmo de backtracking determinístico com poda e verificação de solução estritamente única. | T005 | - | `src/engine/solver.ts` | 🟢 | `[X]` |
| T007 | Criar catálogo de fases curadas pré-validadas com sementes e mapas de regiões conexas de tamanhos $5\times5$ a $8\times8$. | T005 | `[//]` | `src/engine/levels.ts` | 🟢 | `[X]` |
| T008 | Implementar repositório local IndexedDB e módulo de exportação e importação de arquivo JSON de backup da conta (`borkdoku-backup.json`). | T001 | `[//]` | `src/storage/db.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|---|---|---|---|---|---|---|
| T009 | Implementar gerenciador de áudio via Web Audio API com síntese de efeitos sonoros suaves (patinhas, latidinhos e vitória) e controle de mudo. | T001 | `[//]` | `src/audio/sound.ts` | 🟢 | `[X]` |
| T010 | Implementar componente de renderização visual da grade com suporte a toque mobile (toque simples para ossinho, toque para cachorrinho). | T003, T005 | - | `src/ui/board.ts` | 🟡 | `[X]` |
| T011 | Implementar cabeçalho do jogo (timer, botões de ação, mudo e reinício) e tela comemorativa de vitória sem interrupção de anúncios. | T010 | - | `src/ui/hud.ts` | 🟡 | `[X]` |
| T012 | Implementar modal de configurações com exibição de estatísticas pessoais e gatilhos para Fazer Backup e Restaurar Backup JSON. | T008 | - | `src/ui/settings.ts` | 🟡 | `[X]` |
| T013 | Integrar o orquestrador principal em `main.ts` conectando UI, Engine, Áudio e Storage no ciclo completo de jogo. | T009, T010, T011, T012 | - | `src/main.ts` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|---|---|---|---|---|---|---|
| T014 | Implementar `manifest.webmanifest` e Service Worker Cache-First com ativação imediata para suporte 100% offline. | T002, T013 | `[//]` | `public/sw.js` | 🟢 | `[X]` |
| T015 | Criar Dockerfile multi-stage com Nginx Alpine e manifestos Kubernetes (`k8s/deployment.yaml`, `k8s/service.yaml`) para deploy no K3s. | T001 | `[//]` | `Dockerfile` | 🟢 | `[X]` |

---

## Notas de execução

*(Reservado para anotações do agente durante a execução de codificação).*

---

## Histórico de alterações

| Data | Alteração | Autor |
|---|---|---|
| 2026-10-25 | Versão inicial gerada por `/reversa-to-do` | reversa |
