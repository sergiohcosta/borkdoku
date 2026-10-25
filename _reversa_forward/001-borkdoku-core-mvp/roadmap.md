# Roadmap: Borkdoku Core MVP

> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  
> Requirements: `_reversa_forward/001-borkdoku-core-mvp/requirements.md`  
> Confidência: 🟡 PLANEJADO / ESPECIFICADO  

---

## 1. Resumo da abordagem

🟡 A implementação do MVP do Borkdoku adota uma arquitetura modular em TypeScript moderno (sem frameworks pesados para garantir carregamento instantâneo e zero dependências em runtime), estruturada em 4 módulos desacoplados:
1. `src/engine/`: Motor matemático puro de regras e resolução de tabuleiros Queens/Star Battle;
2. `src/ui/`: Gerenciador de renderização responsiva em CSS Grid/Canvas e captura de gestos touch mobile;
3. `src/storage/`: Repositório local IndexedDB/LocalStorage com gerador e validador de backups JSON;
4. `src/pwa/` e `k8s/`: Service Worker de cache integral offline e Dockerfile Alpine com manifestos para o K3s.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|---|---|---|
| **Zero Bloatware / Zero Ads** | Código 100% livre de bibliotecas externas de rastreamento ou redes de anúncios. | respeita |
| **Offline-First Absoluto** | Todos os assets e lógicas operam sem precisar de internet ou backend remoto. | respeita |
| **Soberania dos Dados do Usuário** | Armazenamento local com backup exportável em formato aberto JSON. | respeita |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|---|---|---|---|---|
| 🟡 D-01 | Vanilla TypeScript + Vite para bundling | Garante bundle minificado < 50KB, carregamento instantâneo no mobile e zero overhead de frameworks reativos para um jogo de tabuleiro em grid. | React / Next.js (overhead desnecessário), Flutter Web (bundle > 2MB e canvas pesado). | 🟡 |
| 🟡 D-02 | Algoritmo Backtracking recursivo com poda e PRNG Mulberry32 | Permite gerar tabuleiros reproduzíveis por seed e certificar matematicamente que existe exatamente 1 solução. | Geração aleatória sem validação (gera fases ambíguas ou quebradas). | 🟡 |
| 🟡 D-03 | Web Audio API com síntese procedural / buffers locais | Permite efeitos sonoros suaves e dinâmicos de alta fidelidade sem atrasos de reprodução e com peso insignificante. | Howler.js (dependência externa) ou áudios pesados em MP3 externo. | 🟡 |
| 🟡 D-04 | Nginx Alpine em container Docker multi-stage | Entrega imagem final com < 20MB de tamanho e consumo de RAM < 15MB, ideal para o cluster K3s do homelab. | Servidores baseados em Node.js (alto consumo de memória para servir arquivos estáticos). | 🟡 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|---|---|---|
| 🟡 O navegador do smartphone suporta Web App Manifest e Service Worker moderno (Cache API). | Seção 6 (RNF) | Usuário em navegadores muito antigos não conseguirá instalar na tela inicial (fallback para navegação web tradicional). |
| 🟡 O tamanho padrão de tabuleiro de $6\times6$ a $8\times8$ é o ponto ideal de equilíbrio entre desafio e legibilidade em telas pequenas de celular. | Seção 4 (RN) | Ajustável dinamicamente sem alterar a estrutura do motor. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|---|---|---|---|
| `puzzle-engine` | `_reversa_sdd/sdd/puzzle-engine.md` | componente-novo | Módulo de grid, particionamento de regiões, checagem de 4 regras e solver determinístico. |
| `gameplay-ui` | `_reversa_sdd/sdd/gameplay-ui.md` | componente-novo | Interface visual com tema cozy, gatinhos/cachorrinhos fofos e toques otimizados para smartphone. |
| `progression-storage` | `_reversa_sdd/sdd/progression-storage.md` | componente-novo | Repositório IndexedDB com exportação e importação de arquivo JSON de backup. |
| `pwa-offline-shell` | `_reversa_sdd/sdd/pwa-offline-shell.md` | componente-novo | Manifest, Service Worker Cache-First, síntese de som e container Docker/K3s. |

---

## 6. Delta no modelo de dados

- Resumo das mudanças: O Borkdoku implementa banco local IndexedDB chamado `borkdoku_db` com stores para `completed_levels` e `player_stats`, além de exportação em JSON versionado (`schemaVersion: "1.0"`).
- Detalhe completo em: `_reversa_forward/001-borkdoku-core-mvp/data-delta.md`

---

## 7. Delta de contratos externos

Não há chamadas de API externa ou endpoints remotos no MVP (arquitetura 100% autônoma no cliente).

---

## 8. Plano de migração

1. Criação do scaffolding do projeto com Vite + TypeScript + Tailwind CSS.
2. Implementação e testes unitários do `puzzle-engine` (solver e validação de regras).
3. Implementação dos componentes de renderização visual e gestos táteis em `gameplay-ui`.
4. Integração da camada de persistência IndexedDB e módulo de exportação/importação JSON.
5. Configuração do PWA (Service Worker e Manifest) e criação do Dockerfile + manifests K3s.

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Geração procedural demorar mais de 300ms no celular | Médio | Baixa | Incluir banco pré-compilado de 50 fases curadas no bundle inicial, gerando proceduralmente em Web Worker em segundo plano. |
| Safari Mobile bloquear reprodução de áudio | Médio | Média | Desbloquear `AudioContext` no primeiro toque do jogador em qualquer ponto da tela. |

---

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Testes unitários do motor de regras passando com 100% de sucesso
- [ ] PWA instalado e validado offline no navegador
- [ ] Backup de conta exportado e restaurado com sucesso
- [ ] Dockerfile compilado com sucesso gerando imagem leve

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|---|---|---|
| 2026-10-25 | Versão inicial gerada por `/reversa-plan` | reversa |
