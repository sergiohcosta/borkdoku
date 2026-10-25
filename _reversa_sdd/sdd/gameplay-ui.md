# Spec: gameplay-ui (Interface de Tabuleiro, Interações Touch e Estética Cozy)

> Selo 🟡 PLANEJADO em todos os itens. Documento gerado pelo time Code New Project Agents.

**Versão:** 1.0  
**Status:** Rascunho  
**Autor:** reversa-spec-sdd  
**Data:** 2026-10-25  
**Reviewers:** Sergio  

---

## 1. Resumo

🟡 O componente `gameplay-ui` gerencia toda a apresentação visual, responsividade mobile-first e interações táteis do tabuleiro do Borkdoku. Ele renderiza a grade dividida em regiões coloridas, processa toques do jogador (marcação de apoio com ossinhos e posicionamento de cachorrinhos), exibe feedback de conflitos e animações comemorativas de vitória, mantendo uma atmosfera relaxante e sem poluição publicitária.

---

## 2. Contexto e Motivação

🟡 **Problema:** Jogos casuais de puzzle frequentemente pecam por interfaces com botões minúsculos difíceis de tocar, atrasos de resposta ao toque (*touch lag*), excesso de pop-ups estridentes e paletas de cores berrantes que cansam a visão do jogador que deseja apenas relaxar.

🟡 **Evidências:** Jogadores que utilizam smartphones à noite ou em momentos de descanso abandonam aplicativos com telas piscantes e propagandas em vídeo que destroem o conforto visual.

🟡 **Por que agora:** Para atender a persona Mariana (relaxamento noturno) e a persona Alexandre (foco analítico), o Borkdoku precisa de uma interface tátil polida, suave e de alta precisão de toque.

---

## 3. Goals (Objetivos)

- [ ] 🟡 G-01: Proporcionar taxa de atualização estável de 60 FPS durante renderizações de toques e animações em dispositivos móveis.
- [ ] 🟡 G-02: Garantir tempo de resposta ao toque < 16ms entre o evento de toque e a atualização visual da célula.
- [ ] 🟡 G-03: Assegurar que 100% dos elementos interativos possuam área de toque mínima de $44\times44$ pixels em conformidade com padrões de acessibilidade mobile.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---|---|---|---|
| 🟡 Taxa de quadros (FPS) em animações | N/A | 60 FPS | 30 dias |
| 🟡 Latência de resposta ao toque | N/A | < 16ms | 15 dias |
| 🟡 Conformidade de contraste visual (WCAG AA) | N/A | $\ge 4.5:1$ | 15 dias |

---

## 4. Non-Goals (Fora do Escopo)

- 🟡 NG-01: O componente não executa validação de unicidade matemática ou algoritmos de geração de fases (responsabilidade exclusiva do `puzzle-engine`).
- 🟡 NG-02: O componente não manipula armazenamento em banco de dados local ou lógica de backup (responsabilidade do `progression-storage`).
- 🟡 NG-03: O componente não renderiza banners, anúncios em vídeo ou pop-ups de monetização de terceiros.

---

## 5. Usuários e Personas

🟡 **Usuário primário:** Mariana (A Jogadora Casual em Busca de Descompressão), que joga deitada na cama à noite e exige interface limpa, modo noturno e gatinhos/cachorrinhos carismáticos.  
🟡 **Usuário secundário:** Lucas (Iniciante Curioso), que depende de destaques visuais claros para compreender onde um cachorrinho pode ou não ficar.

**Jornada atual (sem a feature):** O jogador toca na tela e sofre com toques perdidos, menus barulhentos e vídeos que pulam na tela.  
**Jornada futura (com a feature):** O jogador toca na célula com precisão e fluidez, vendo o cachorrinho acomodar-se confortavelmente com feedback tátil e sonoro sutil.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| 🟡 RF-01 | O sistema deve renderizar a grade de células e suas respectivas regiões coloridas em layout responsivo adaptável à largura da tela mobile. | Must | Verificar que a grade se ajusta perfeitamente em telas com larguras entre 320px e 1200px sem overflow horizontal. |
| 🟡 RF-02 | O usuário deve poder alternar o estado de uma célula entre 'vazio', 'bloqueado com ossinho' e 'cachorrinho posicionado' através de toques diretos. | Must | Toque simples marca bloqueio com ossinho; segundo toque posiciona cachorrinho; terceiro toque limpa a célula. |
| 🟡 RF-03 | O sistema deve disponibilizar uma barra de alternância de modo (Modo Cachorrinho vs. Modo Ossinho de Apoio) para acessibilidade de toque rápido. | Must | Com o modo cachorrinho ativo na barra inferior, todo toque em célula vazia posiciona diretamente o cachorrinho. |
| 🟡 RF-04 | O sistema deve destacar visualmente em tom suave de alerta as células envolvidas em conflitos de regras (linha, coluna, região ou adjacência diagonal). | Must | Quando houver colisão de regras, as células infratoras exibem contorno pulsante suave indicando o erro. |
| 🟡 RF-05 | O sistema deve exibir uma tela de vitória elegante e acolhedora com animação do cachorrinho feliz quando o quebra-cabeça for resolvido com sucesso. | Must | Ao concluir o tabuleiro, uma animação sutil é disparada junto com a exibição do tempo decorrido e botão direto para 'Próxima Fase'. |
| 🟡 RF-06 | O usuário deve poder reiniciar a fase atual ou limpar todas as marcações de apoio com um único toque em botão dedicado de reset. | Should | Tocar no botão de reiniciar solicita confirmação rápida ou restaura o tabuleiro inicial sem recarregar a página. |
| 🟡 RF-07 | O sistema deve disponibilizar um alternador de tema visual (Tema Pastel Aconchegante e Tema Noturno/Dark Mode para descanso visual). | Should | Alternar o seletor altera instantaneamente as variáveis CSS de cor de fundo e paleta das regiões do tabuleiro. |

### 6.2 Fluxo Principal (Happy Path)

1. O usuário abre a tela do quebra-cabeça e visualiza a grade centralizada com suas regiões coloridas contrastadas.
2. O usuário toca em células que deduziu como vazias para marcar ícones de bloqueio (ossinhos de auxílio).
3. O usuário toca na célula correta para posicionar o cachorrinho daquela região.
4. O sistema atualiza o tabuleiro imediatamente sem oscilações visuais e valida as regras com o motor lógico.
5. O usuário posiciona o último cachorrinho sem conflitos e a tela exibe imediatamente a celebração de vitória sem anúncios.

### 6.3 Fluxos Alternativos

**Fluxo Alternativo A — Violação de Espaço Diagonal:**
1. O usuário posiciona um cachorrinho em uma célula diagonalmente adjacente a outro já existente.
2. O sistema exibe um tremor suave e destaca ambas as células em cor de alerta suave.
3. O usuário toca no cachorrinho conflituoso para desfazê-lo e o alerta visual desaparece instantaneamente.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|---|---|---|---|
| 🟡 RNF-01 | Prevenção de gestos acidentais | `touch-action: manipulation` | Desativação de zoom com duplo toque para evitar atrasos de 300ms na resposta do clique. |
| 🟡 RNF-02 | Acessibilidade visual de cores | Paletas testadas | Uso de texturas ou sutis variações de tom para diferenciar regiões para pessoas daltônicas. |
| 🟡 RNF-03 | Tamanho do bundle de estilos e ícones | < 45KB gzipped | SVGs vetoriais puros para os cachorrinhos e ossinhos, sem assets pesados de imagem rasterizada. |

---

## 8. Design e Interface

🟡 **Comportamento da UI e Estados:**
- **Estado Vazio:** Grade limpa com fundo suave em tons creme/bege ou grafite escuro (modo noturno).
- **Estado de Seleção:** Célula selecionada recebe elevação e borda levemente destacada.
- **Estado de Conflito:** Células que violam regras recebem brilho suave avermelhado.
- **Estado de Vitória:** Modal minimalista translúcido com o cachorrinho abanando o rabo, estatísticas da partida e botão "Continuar".

---

## 9. Modelo de Dados

```typescript
export interface UITheme {
  id: 'cozy-light' | 'cozy-dark';
  background: string;
  gridBorder: string;
  regionColors: string[]; // Cores harmônicas para as N regiões
  dogIcon: string;
  boneIcon: string;
}

export type InputInteractionMode = 'toggle' | 'dog-only' | 'bone-only';

export interface UIState {
  boardSize: number;
  selectedCell: { row: number; col: number } | null;
  interactionMode: InputInteractionMode;
  theme: UITheme;
  isVictoryCelebrationActive: boolean;
}
```

---

## 10. Integrações e Dependências

🟡 **Dependências externas:**
- Módulo `puzzle-engine` para validação matemática de jogadas.
- Módulo `progression-storage` para recuperar preferências de tema e salvar vitórias.
- Biblioteca de ícones vetoriais leves em SVG integrados diretamente nos componentes.

---

## 11. Edge Cases e Cenários de Erro

| ID | Cenário / Gatilho | Comportamento Esperado do Sistema |
|---|---|---|
| 🟡 EC-01 | Rotação brusca da tela do smartphone (mudança entre modo retrato e paisagem) | O sistema recalcula as dimensões através de CSS viewport dinâmico (`100dvh`), mantendo o tabuleiro perfeitamente centralizado e visível sem corte. |
| 🟡 EC-02 | Toque simultâneo acidental com múltiplos dedos na tela | O sistema processa apenas o primeiro identificador de toque (`TouchEvent.changedTouches[0]`), ignorando eventos multitouch secundários para evitar corrupção de estado. |
| 🟡 EC-03 | Falha no carregamento de asset SVG de cachorrinho ou estilo externo | O sistema possui renderizadores de fallback em SVG inline nativo, garantindo que o tabuleiro nunca fique invisível. |
| 🟡 EC-04 | Usuário toca repetidamente em alta velocidade na mesma célula | O sistema aplica debounce de 25ms para evitar transições de estado espúrias em telas touch com alta sensibilidade. |

---

## 12. Segurança e Privacidade

🟡 O componente não solicita permissões de câmera, microfone, localização ou contatos, operando em sandbox isolada no navegador web.

---

## 13. Plano de Rollout e Rollback

🟡 **Rollout:** Disponibilizado como módulo frontend principal servido pelo PWA com testes em dispositivos Android (Chrome) e iOS (Safari).  
🟡 **Rollback:** Em caso de problema de renderização em versões legadas de Safari, um modo simplificado com CSS Grid padrão e sem filtros gráficos de sombra é acionado automaticamente.

---

## 14. Open Questions

- 🟡 OQ-01: ⚠️ ABERTO: Devemos incluir um botão de 'Desfazer' (Undo) com pilha histórica de até 20 jogadas na barra de ferramentas do jogo?

---

## Relatório de Avaliação de Qualidade

```
============================================================
  SPEC QUALITY REPORT
  Arquivo: _reversa_sdd/sdd/gameplay-ui.md
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

Gerado por reversa-spec-sdd em 2026-10-25T12:05:00Z  
Fonte: prd.md
