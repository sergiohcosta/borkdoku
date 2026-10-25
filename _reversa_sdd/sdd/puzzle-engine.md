# Spec: puzzle-engine (Motor de Regras, Validação e Geração)

> Selo 🟡 PLANEJADO em todos os itens. Documento gerado pelo time Code New Project Agents.

**Versão:** 1.0  
**Status:** Rascunho  
**Autor:** reversa-spec-sdd  
**Data:** 2026-10-25  
**Reviewers:** Sergio  

---

## 1. Resumo

🟡 O componente `puzzle-engine` é o núcleo matemático e algorítmico do Borkdoku. Ele é responsável pela representação matricial da grade ($N \times N$, de $5\times5$ a $9\times9$), particionamento em $N$ regiões conexas coloridas, validação estrita das regras lógicas do estilo Queens/Star Battle e geração determinística de tabuleiros garantindo unicidade de solução via algoritmo de busca com poda (backtracking).

---

## 2. Contexto e Motivação

🟡 **Problema:** Em jogos de lógica dedutiva, se um tabuleiro tiver múltiplas soluções válidas ou nenhuma solução viável, o jogador analítico sente que o jogo é injusto e que sua dedução falhou por erro de software, quebrando imediatamente a confiança no produto.

🟡 **Evidências:** Relatos comuns em quebra-cabeças casuais mobile apontam tabuleiros gerados aleatoriamente sem validação de unicidade, forçando o jogador a adivinhar em vez de deduzir logicamente.

🟡 **Por que agora:** Como o Borkdoku visa substituir jogos comerciais cheios de anúncios por uma experiência limpa e de alta qualidade técnica, a precisão matemática do motor é o alicerce indispensável de todo o sistema.

---

## 3. Goals (Objetivos)

- [ ] 🟡 G-01: Garantir que 100% dos tabuleiros gerados possuam exatamente 1 solução válida e única comprovada matematicamente.
- [ ] 🟡 G-02: Executar a validação completa de regras do estado atual do tabuleiro em tempo de execução < 15ms.
- [ ] 🟡 G-03: Suportar grades quadradas variáveis de $5\times5$ a $9\times9$ células com particionamento automático de regiões conexas.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---|---|---|---|
| 🟡 Unicidade de solução dos tabuleiros | 0% | 100% | 15 dias |
| 🟡 Latência de validação de jogada | N/A | < 15ms | 15 dias |
| 🟡 Tempo de geração procedural por fase | N/A | < 250ms | 30 dias |

---

## 4. Non-Goals (Fora do Escopo)

- 🟡 NG-01: O componente não renderiza elementos gráficos nem manipula o DOM do navegador (responsabilidade exclusiva do `gameplay-ui`).
- 🟡 NG-02: O componente não faz chamadas de rede ou persistência em disco (responsabilidade exclusiva do `progression-storage`).
- 🟡 NG-03: O componente não implementa quebra-cabeças de formatos não retangulares ou grades tridimensionais no MVP.

---

## 5. Usuários e Personas

🟡 **Usuário primário:** Alexandre (O Mestre dos Desafios Lógicos), que exige coerência matemática absoluta em grades $8\times8$ e $9\times9$ e não tolera ambiguidades de solução.  
🟡 **Usuário secundário:** Mariana e Lucas, que necessitam de detecção de erros precisa e consistente para aprender e relaxar.

**Jornada atual (sem a feature):** O jogador joga cópias mal implementadas que geram tabuleiros ambíguos onde deduções lógicas puras falham.  
**Jornada futura (com a feature):** O jogador tem a certeza matemática de que cada tabuleiro é solucionável exclusivamente por dedução pura, sem adivinhação.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| 🟡 RF-01 | O sistema deve representar a grade de jogo como uma matriz bidimensional de tamanho $N \times N$, onde $N \in [5, 9]$. | Must | Verificar que instâncias da matriz suportam dimensões de 5 a 9 com coordenadas $(linha, coluna)$. |
| 🟡 RF-02 | O sistema deve particionar a grade em exatamente $N$ regiões coloridas disjuntas, onde cada região é um grafo conexo ortogonal de células. | Must | Teste unitário confirmando que toda célula pertence a exatamente uma região e que cada região é conexa via BFS/DFS. |
| 🟡 RF-03 | O sistema deve validar a Regra de Linha: cada linha $i$ deve conter no máximo 1 cachorrinho colocado (e exatamente 1 no estado final de vitória). | Must | Submeter grade com 2 cachorrinhos na mesma linha e verificar retorno de infração `ROW_CONFLICT`. |
| 🟡 RF-04 | O sistema deve validar a Regra de Coluna: cada coluna $j$ deve conter no máximo 1 cachorrinho colocado (e exatamente 1 no estado final de vitória). | Must | Submeter grade com 2 cachorrinhos na mesma coluna e verificar retorno de infração `COLUMN_CONFLICT`. |
| 🟡 RF-05 | O sistema deve validar a Regra de Região: cada região colorida $R_k$ deve conter no máximo 1 cachorrinho colocado (e exatamente 1 no estado final de vitória). | Must | Submeter grade com 2 cachorrinhos na mesma região e verificar retorno de infração `REGION_CONFLICT`. |
| 🟡 RF-06 | O sistema deve validar a Regra do Espaço Pessoal: nenhum cachorrinho pode ocupar célula adjacente (ortogonal ou diagonal) a outro cachorrinho. | Must | Submeter grade com dois cachorrinhos tocando-se diagonalmente e verificar retorno de infração `DIAGONAL_TOUCH_CONFLICT`. |
| 🟡 RF-07 | O sistema deve conter um resolvedor determinístico (solver) que contabiliza a quantidade total de soluções válidas para uma configuração de regiões. | Must | O solver deve retornar 0 se insolúvel, 1 se solução única, ou $\ge 2$ se houver ambiguidade. |
| 🟡 RF-08 | O sistema deve verificar a condição de vitória global: exatamente $N$ cachorrinhos posicionados sem nenhuma infração ativa. | Must | Retornar status booleano `isSolved: true` se e somente se as 4 regras forem plenamente satisfeitas. |

### 6.2 Fluxo Principal (Happy Path)

1. O sistema recebe a solicitação de geração de uma nova fase com tamanho $N$ e seed numérico específico.
2. O sistema gera a partição de $N$ regiões conexas e executa o solver determinístico com poda para comprovar se existe exatamente 1 solução.
3. O sistema entrega a definição imutável do tabuleiro (dimensão, mapa de regiões por célula e máscara de solução) para a interface.
4. O usuário posiciona um cachorrinho ou marcação de apoio em uma célula válida.
5. O sistema reavalia instantaneamente os estados de conflito e retorna o status atualizado de regras e veredito de vitória.

### 6.3 Fluxos Alternativos

**Fluxo Alternativo A — Descarte de tabuleiro ambíguo durante geração:**
1. O gerador cria uma partição de regiões candidata.
2. O solver detecta 2 ou mais soluções possíveis para o tabuleiro.
3. O sistema descarta a partição e tenta nova mutação procedural até encontrar configuração com solução estritamente única.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|---|---|---|---|
| 🟡 RNF-01 | Tempo de execução do solver para grade $8\times8$ | < 100ms | Algoritmo implementado com bitmasks para maximizar performance. |
| 🟡 RNF-02 | Determinismo na geração por seed | 100% reproduzível | O mesmo número de semente deve gerar rigorosamente o mesmo tabuleiro em qualquer plataforma. |
| 🟡 RNF-03 | Cobertura de testes unitários | $\ge 95\%$ | Testes cobrindo todas as permutações de regras e colisões diagonais. |

---

## 8. Design e Interface

🟡 **Arquitetura Lógica do Módulo:**
- `GridModel`: Estrutura de dados imutável representando a grade, regiões e células.
- `RuleValidator`: Módulo puro que recebe um estado de marcações e retorna lista de infrações `{ type, cells }`.
- `PuzzleSolver`: Algoritmo backtracking recursivo com contagem de soluções.
- `PuzzleGenerator`: Orquestrador de criação procedural baseada em sementes pseudoaleatórias (PRNG Mulberry32).

---

## 9. Modelo de Dados

```typescript
export interface CellCoord {
  row: number;
  col: number;
}

export type CellState = 'empty' | 'dog' | 'blocked';

export interface PuzzleDefinition {
  id: string;
  size: number; // 5 a 9
  regions: number[][]; // matriz size x size com ID da região (0 a size - 1)
  seed: number;
}

export interface RuleViolation {
  rule: 'row' | 'col' | 'region' | 'diagonal';
  involvedCells: CellCoord[];
}
```

---

## 10. Integrações e Dependências

🟡 **Dependências externas:** Nenhuma dependência externa de pacotes ou APIs. Implementado em TypeScript puro para portabilidade máxima em navegadores, workers ou testes de terminal.

---

## 11. Edge Cases e Cenários de Erro

| ID | Cenário / Gatilho | Comportamento Esperado do Sistema |
|---|---|---|
| 🟡 EC-01 | Solicitação de tamanho de grade inválido ($N < 5$ ou $N > 9$) | O sistema rejeita o parâmetro, lança exceção tipada `InvalidGridSizeError` e aplica fallback seguro para tamanho padrão $6\times6$. |
| 🟡 EC-02 | Estouro de tempo limite de busca no gerador (> 500ms na geração procedural) | O sistema aborta a tentativa atual por timeout, registra log interno e utiliza como fallback um tabuleiro curado pré-validado do catálogo estático. |
| 🟡 EC-03 | O jogador preenche todas as $N$ casas com cachorrinhos, havendo duas peças adjacentes na diagonal | O sistema não concede vitória, destaca as duas células conflitantes em vermelho e sinaliza violação `DIAGONAL_TOUCH_CONFLICT`. |
| 🟡 EC-04 | Falha de inicialização por semente corrompida ou NaN | O sistema detecta o valor espúrio, gera uma nova semente criptograficamente aleatória através de `crypto.getRandomValues()` e prossegue sem travar. |

---

## 12. Segurança e Privacidade

🟡 O componente opera exclusivamente em memória no cliente, sem transferir dados de jogadas ou parâmetros sensíveis para qualquer entidade remota.

---

## 13. Plano de Rollout e Rollback

🟡 **Rollout:** Disponibilizado diretamente como módulo interno do bundle da aplicação, validado previamente por bateria de testes automatizados com 10.000 iterações de geração de puzzles.  
🟡 **Rollback:** Caso seja detectada regressão de performance em dispositivos antigos, o gerador procedural dinâmico pode ser desativado temporariamente via flag de configuração, servindo exclusivamente o catálogo curado pré-compilado.

---

## 14. Open Questions

- 🟡 OQ-01: ⚠️ ABERTO: Devemos pré-computar e empacotar um banco de 200 fases curadas no bundle inicial para garantir tempo de carregamento zero mesmo em celulares muito lentos?

---

## Relatório de Avaliação de Qualidade

```
============================================================
  SPEC QUALITY REPORT
  Arquivo: _reversa_sdd/sdd/puzzle-engine.md
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

Gerado por reversa-spec-sdd em 2026-10-25T12:03:00Z  
Fonte: prd.md
