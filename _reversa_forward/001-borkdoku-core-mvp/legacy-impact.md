# Legacy Impact: Borkdoku Core MVP

> Feature greenfield, sem legado pré-existente. Âncora: prd.md + specs SDD.  
> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  
> Política de edição: `allowLegacyEdits: true` (liberação de escrita irrestrita para arquivos do projeto)  

---

## 1. Mapeamento de Arquivos Criados por Componente SDD

| Arquivo Criado | Componente SDD Ancorado | Tipo de Impacto | Severidade | Justificativa |
|---|---|---|---|---|
| `src/engine/rules.ts` | `puzzle-engine` | componente-novo | LOW | Implementação das 4 regras do jogo e modelo de grade |
| `src/engine/solver.ts` | `puzzle-engine` | componente-novo | LOW | Solver determinístico com backtracking e verificação de unicidade |
| `src/engine/levels.ts` | `puzzle-engine` | componente-novo | LOW | Catálogo curado de 8 fases pré-validadas com soluções únicas |
| `src/engine/rules.test.ts` | `puzzle-engine` | componente-novo | LOW | Suíte de testes unitários para regras lógicas |
| `src/engine/solver.test.ts` | `puzzle-engine` | componente-novo | LOW | Suíte de testes unitários para o resolvedor |
| `src/ui/board.ts` | `gameplay-ui` | componente-novo | LOW | Renderização responsiva da grade e detecção de toques |
| `src/ui/hud.ts` | `gameplay-ui` | componente-novo | LOW | Barra de status, cronômetro, controles e tela de vitória |
| `src/ui/settings.ts` | `gameplay-ui` | componente-novo | LOW | Modal de ajustes, estatísticas e gatilhos de backup |
| `src/styles.css` | `gameplay-ui` | componente-novo | LOW | Estilos e paletas de cores aconchegantes (*cozy dog*) |
| `src/storage/db.ts` | `progression-storage` | componente-novo | LOW | Persistência local e módulo de exportação/importação de backup JSON |
| `src/storage/db.test.ts` | `progression-storage` | componente-novo | LOW | Suíte de testes unitários para persistência e backup |
| `src/audio/sound.ts` | `pwa-offline-shell` | componente-novo | LOW | Síntese de efeitos sonoros suaves via Web Audio API |
| `public/sw.js` | `pwa-offline-shell` | componente-novo | LOW | Service Worker Cache-First para disponibilidade 100% offline |
| `public/manifest.webmanifest` | `pwa-offline-shell` | componente-novo | LOW | Web App Manifest para instalação nativa PWA |
| `public/favicon.svg` | `pwa-offline-shell` | componente-novo | LOW | Ícone vetorial aconchegante de cachorrinho |
| `Dockerfile` | `pwa-offline-shell` | componente-novo | LOW | Imagem multi-stage Nginx Alpine leve para K3s |
| `nginx.conf` | `pwa-offline-shell` | componente-novo | LOW | Configuração otimizada com cache headers e gzip |
| `k8s/deployment.yaml` | `pwa-offline-shell` | componente-novo | LOW | Manifesto Kubernetes de Deployment para cluster K3s |
| `k8s/service.yaml` | `pwa-offline-shell` | componente-novo | LOW | Manifesto Kubernetes de Service ClusterIP para K3s |
| `src/main.ts` | `gameplay-ui` | componente-novo | LOW | Orquestrador principal conectando todos os módulos |
| `index.html` | `gameplay-ui` | componente-novo | LOW | Casca HTML mobile-first |
| `package.json` | - | componente-novo | LOW | Scaffolding e dependências do projeto |
| `tsconfig.json` | - | componente-novo | LOW | Configurações do compilador TypeScript |
| `vite.config.ts` | - | componente-novo | LOW | Configurações do bundler Vite |

---

## 2. Diff Conceitual por Componente

- **`puzzle-engine`**: Entrega completa da validação das 4 regras do jogo Queens com gatinhos/cachorrinhos e algoritmo determinístico com unicidade comprovada.
- **`gameplay-ui`**: Interface mobile fluida com visual aconchegante, alternador de modos de entrada, animação de vitória e zero propagandas.
- **`progression-storage`**: Persistência 100% no cliente sem dependência de nuvem e utilitário de exportação/importação de arquivo `borkdoku-backup.json`.
- **`pwa-offline-shell`**: Suporte offline completo via Service Worker e receita pronta para deploy conteinerizado no K3s.

---

## 3. Regras Preservadas
*(N/A — Feature greenfield, sem código legado pré-existente).*

---

## 4. Regras Modificadas
*(N/A — Feature greenfield, sem código legado pré-existente).*
