# Regression Watch: Borkdoku Core MVP

> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  
> Status: Inicializado (cenário greenfield)  

---

## 1. Tabela Principal de Verificação

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| *(Nenhuma regra confirmada 🟢 pré-existente no projeto)* | - | - | - | - |

---

## 2. Histórico de Re-extrações

*(Vazio inicialmente — será preenchido quando uma futura execução do `/reversa` for acionada para consolidar o código novo em especificações 🟢).*

---

## 3. Arquivadas

*(Nenhum item arquivado).*

---

## 4. Observações (Requisitos Funcionais Implementados nesta Feature)

Itens derivados das especificações SDD implementados na feature `001-borkdoku-core-mvp`:

- **W001 (puzzle-engine):** Grade $N \times N$ com $N$ regiões coloridas disjuntas e conexas ortogonalmente.
- **W002 (puzzle-engine):** Exatamente 1 cachorrinho por linha, coluna e região no tabuleiro solucionado.
- **W003 (puzzle-engine):** Restrição de espaço pessoal estrito: nenhum cachorrinho pode tocar outro (ortogonal ou diagonalmente).
- **W004 (puzzle-engine):** Solver com garantia de unicidade estrita de solução.
- **W005 (gameplay-ui):** Layout mobile-first responsivo e adaptável sem overflow horizontal.
- **W006 (gameplay-ui):** Toque simples para ossinho de apoio e toque para posicionar cachorrinho com feedback imediato.
- **W007 (gameplay-ui):** Destaque visual suave de infrações de regras sem travamento de tela.
- **W008 (progression-storage):** Armazenamento local seguro do progresso e estatísticas de jogo sem cookies de terceiros.
- **W009 (progression-storage):** Exportação e importação de arquivo JSON de backup da conta com validação de versão.
- **W010 (pwa-offline-shell):** Funcionamento 100% offline via Service Worker com estratégia Cache-First.
- **W011 (pwa-offline-shell):** Configuração de container Docker Nginx Alpine e manifestos prontos para o cluster K3s.
