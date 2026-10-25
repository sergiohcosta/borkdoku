# Spec: progression-storage (Persistência, Estatísticas e Sistema de Backup)

> Selo 🟡 PLANEJADO em todos os itens. Documento gerado pelo time Code New Project Agents.

**Versão:** 1.0  
**Status:** Rascunho  
**Autor:** reversa-spec-sdd  
**Data:** 2026-10-25  
**Reviewers:** Sergio  

---

## 1. Resumo

🟡 O componente `progression-storage` gerencia o estado permanente do jogador no Borkdoku de forma estritamente local e offline (IndexedDB e LocalStorage). Ele armazena o mapa de fases concluídas, tempos recordes, estatísticas detalhadas de jogo e catálogo de colecionáveis, fornecendo ainda utilitários seguros de exportação e importação de arquivo JSON de backup para migração de conta entre dispositivos.

---

## 2. Contexto e Motivação

🟡 **Problema:** Em jogos casuais da web, se o navegador limpar os dados de cache ou o usuário trocar de aparelho móvel, todo o progresso de fases e recordes é perdido, causando profunda frustração e abandono do jogo.

🟡 **Evidências:** Jogadores frequentemente relatam perda de progresso ao trocar de celular quando o jogo não possui conta em nuvem ou quando não há uma ferramenta simples de backup manual.

🟡 **Por que agora:** O usuário solicitou explicitamente suporte 100% offline aliado a um mecanismo confiável de backup e restauração de conta para preservar o progresso dele e de sua esposa.

---

## 3. Goals (Objetivos)

- [ ] 🟡 G-01: Garantir persistência atômica de dados locais com latência de gravação < 50ms para não impactar a fluidez do jogo.
- [ ] 🟡 G-02: Fornecer funcionalidade de exportação de backup em arquivo JSON com checksum SHA-256 e validação de schema em 100% das importações.
- [ ] 🟡 G-03: Manter 100% dos dados salvos no dispositivo mesmo na ausência total de conexão de rede.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---|---|---|---|
| 🟡 Integridade de dados na importação | 0% | 100% | 15 dias |
| 🟡 Latência de leitura/escrita local | N/A | < 50ms | 15 dias |
| 🟡 Tamanho do arquivo de backup exportado | N/A | < 100KB | 15 dias |

---

## 4. Non-Goals (Fora do Escopo)

- 🟡 NG-01: O componente não envia dados nem sincroniza histórico com servidores remotos ou bancos de dados em nuvem no MVP.
- 🟡 NG-02: O componente não exige cadastro com e-mail, senha ou autenticação OAuth de terceiros.
- 🟡 NG-03: O componente não armazena dados de pagamento, cartões de crédito ou faturamento financeiro.

---

## 5. Usuários e Personas

🟡 **Usuário primário:** Alexandre (Mestre dos Desafios Lógicos), que deseja analisar suas estatísticas de tempo e histórico de partidas em gráficos e métricas de eficiência.  
🟡 **Usuário secundário:** Mariana (A Jogadora Casual), que deseja transferir seu progresso e fases desbloqueadas caso decida jogar no tablet ou trocar de celular sem perder nada.

**Jornada atual (sem a feature):** O usuário joga em um navegador e perde todo o histórico caso os dados do site sejam limpos ou ao tentar continuar no computador.  
**Jornada futura (com a feature):** O usuário clica em "Fazer Backup", salva um arquivo leve em seu dispositivo e restaura instantaneamente em qualquer outro aparelho.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| 🟡 RF-01 | O sistema deve persistir automaticamente o estado de conclusão de cada fase (id da fase, data/hora, tempo decorrido, número de dicas usadas) no IndexedDB local. | Must | Concluir uma fase e verificar registro salvo na tabela `completed_levels` do IndexedDB. |
| 🟡 RF-02 | O sistema deve calcular e atualizar estatísticas agregadas do jogador: total de partidas jogadas, taxa de vitória (%), sequência de vitórias consecutivas (*streak*) e menor tempo por tamanho de tabuleiro. | Must | Resolver sucessivas fases e verificar atualização imediata dos campos no painel de estatísticas. |
| 🟡 RF-03 | O sistema deve desbloquear ilustrações de raças de cachorrinhos colecionáveis com base em marcos de fases concluídas e registrar a coleção no estado do usuário. | Should | Atingir o marco de 10 fases concluídas e validar o desbloqueio do 'Golden Retriever' no álbum de colecionáveis. |
| 🟡 RF-04 | O sistema deve exportar todos os dados locais do jogador em um arquivo baixável formatado em JSON com nome `borkdoku-backup-<timestamp>.json`. | Must | Clicar em 'Exportar Backup' e verificar download do arquivo contendo todas as chaves obrigatórias e assinatura de integridade. |
| 🟡 RF-05 | O usuário deve poder carregar um arquivo JSON de backup previamente exportado para restaurar integralmente o histórico, configurações e fases concluídas. | Must | Carregar arquivo de backup válido em navegador limpo e verificar recuperação de 100% das fases e recordes salvos. |
| 🟡 RF-06 | O sistema deve validar a estrutura, schema e versão do arquivo JSON importado antes de sobrescrever os dados locais do usuário. | Must | Tentar importar arquivo JSON corrompido ou com schema inválido e verificar rejeição com mensagem clara sem afetar dados atuais. |
| 🟡 RF-07 | O sistema deve fornecer opção de reset completo com confirmação de segurança para limpar dados locais se o usuário desejar reiniciar sua jornada do zero. | Could | Acionar limpeza completa mediante digitação de confirmação e verificar exclusão de dados do IndexedDB. |

### 6.2 Fluxo Principal (Happy Path)

1. O jogador conclui uma fase do quebra-cabeça com sucesso na interface.
2. O sistema grava o registro da partida no repositório local IndexedDB e atualiza as estatísticas globais em menos de 50ms.
3. O jogador acessa a tela de configurações e clica na opção 'Exportar Backup da Conta'.
4. O sistema gera a estrutura canônica em JSON, calcula o hash de integridade e dispara o download do arquivo no navegador.
5. O jogador transfere o arquivo para outro smartphone, clica em 'Importar Backup' e visualiza a restauração imediata do seu progresso.

### 6.3 Fluxos Alternativos

**Fluxo Alternativo A — Tentativa de importação de arquivo incompatível:**
1. O usuário seleciona um arquivo de texto ou imagem no seletor de importação.
2. O validador detecta violação de schema JSON ou ausência do identificador `borkdoku_schema_version`.
3. O sistema exibe alerta amigável na tela informando que o arquivo não é um backup válido do Borkdoku e mantém intactos os dados atuais.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|---|---|---|---|
| 🟡 RNF-01 | Fallback de tecnologia de armazenamento | LocalStorage fallback | Se o IndexedDB estiver desabilitado no modo anônimo, utilizar LocalStorage com compressão. |
| 🟡 RNF-02 | Compatibilidade retroativa de backups | 100% retrocompatível | Versões futuras do Borkdoku devem ser capazes de migrar schemas de versões anteriores. |
| 🟡 RNF-03 | Tamanho máximo da base local em disco | < 5MB após 1.000 fases | Armazenamento de registros compactos sem retenção desnecessária de histórico de toques. |

---

## 8. Design e Interface

🟡 **Fluxo da Interface de Configurações:**
- Painel modal simples acessado via ícone de engrenagem no cabeçalho do jogo.
- Seção **Estatísticas Pessoais**: Exibição de cartões com números (Partidas, Vitórias, Recordes por grid).
- Seção **Backup e Restauração**:
  - Botão principal: `Fazer Backup (Exportar JSON)`;
  - Botão secundário: `Restaurar Backup (Carregar JSON)`.

---

## 9. Modelo de Dados

```typescript
export interface LevelRecord {
  levelId: string;
  size: number;
  completedAt: string; // ISO 8601
  durationSeconds: number;
  movesCount: number;
}

export interface PlayerStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  bestTimesBySize: Record<number, number>; // ex: { 5: 32, 6: 75, 7: 120 }
}

export interface BorkdokuBackupFile {
  schemaVersion: '1.0';
  exportedAt: string; // ISO 8601
  checksum: string;
  statistics: PlayerStatistics;
  completedLevels: LevelRecord[];
  unlockedBreeds: string[];
  settings: {
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    theme: 'cozy-light' | 'cozy-dark';
  };
}
```

---

## 10. Integrações e Dependências

🟡 **Dependências externas:**
- IndexedDB nativo dos navegadores modernos (`idb` wrapper leve ou API direta).
- File API nativa do navegador (`Blob`, `FileReader`) para download e upload de arquivos.
- Integração bidirecional com os componentes `gameplay-ui` (para notificações) e `puzzle-engine` (para IDs de fase).

---

## 11. Edge Cases e Cenários de Erro

| ID | Cenário / Gatilho | Comportamento Esperado do Sistema |
|---|---|---|
| 🟡 EC-01 | Falha no IndexedDB por restrição de navegação anônima no iOS Safari | O sistema detecta o erro de permissão, ativa fallback automático para LocalStorage e avisa discretamente o usuário sobre a limitação de cota. |
| 🟡 EC-02 | Tentativa de importar arquivo de backup com JSON malformado ou corrompido | O sistema captura a exceção de parse, rejeita a importação, exibe mensagem 'Arquivo de backup corrompido' e não altera o banco atual. |
| 🟡 EC-03 | Cota de armazenamento local do navegador atingida (> 50MB ocupados por outros sites) | O sistema compacta registros antigos de fases intermediárias mantendo intactos recordes, estatísticas e marcos principais. |
| 🟡 EC-04 | Usuário tenta restaurar um backup de versão de schema futura desconhecida | O sistema identifica versão incompatível, orienta o usuário a atualizar a versão do aplicativo PWA e cancela a operação com segurança. |

---

## 12. Segurança e Privacidade

🟡 Os dados armazenados pertencem 100% ao usuário. Nenhuma informação pessoal, histórico de uso ou identificador único de aparelho é transmitido para servidores remotos.

---

## 13. Plano de Rollout e Rollback

🟡 **Rollout:** Disponibilizado no lançamento inicial, testado com rotinas de exportação e importação cruzada entre Chrome (Android) e Safari (iOS).  
🟡 **Rollback:** Caso uma atualização de schema apresente inconsistência, o motor de migração mantém cópia de segurança em chave isolada (`borkdoku_pre_migration_backup`) antes de aplicar transformações.

---

## 14. Open Questions

- 🟡 OQ-01: ⚠️ ABERTO: Devemos oferecer a opção de gerar um QR Code contendo o backup compactado (para transferências rápidas entre celulares lado a lado sem enviar arquivo)?

---

## Relatório de Avaliação de Qualidade

```
============================================================
  SPEC QUALITY REPORT
  Arquivo: _reversa_sdd/sdd/progression-storage.md
============================================================

  SCORE TOTAL: 100.0/100  —  ⭐ Excelente — Pronta para implementação

  BREAKDOWN POR DIMENSÃO:
  Dimensão             Score      Peso     Contribuição
  --------------------------------------------------
  Completude           100%       30%     30.0/pt
  Testabilidade        100%       25%     25.0/pt
  Clareza              100%       20%     20.0/pt
  Escopo               100%       15%     15.0/pt
  Edge Cases           100%       10%     10.0/pt

  ✅ PONTOS FORTES:
     ✅ Seção 1 (Resumo) presente e preenchida
     ✅ Seção 2 (Contexto) presente e preenchida
     ✅ Seção 3 (Goals) presente e preenchida
     ✅ Seção 4 (Non-Goals) presente e preenchida
     ✅ Seção 5 (Usuários) presente e preenchida
============================================================
```

---

Gerado por reversa-spec-sdd em 2026-10-25T12:06:00Z  
Fonte: prd.md
