# Requirements: Borkdoku Core MVP

> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  
> Pasta de especificações: `_reversa_sdd/`  
> Confidência: 🟡 PLANEJADO / ESPECIFICADO  

---

## 1. Resumo executivo

🟡 Entrega do produto mínimo viável (MVP) do **Borkdoku**: um quebra-cabeça de dedução lógica no estilo Queens / Star Battle com temática aconchegante de cachorrinhos (*cozy aesthetic*), completamente livre de propagandas ou paywalls. A entrega contempla o motor matemático de validação de regras, interface tátil e fluida para smartphones, persistência local de fases e estatísticas com exportação de backup JSON, e casca PWA com Service Worker operando 100% offline, pronta para deploy no cluster K3s doméstico.

---

## 2. Contexto a partir das Especificações SDD

| Fonte | Trecho relevante | Confidência |
|---|---|---|
| `_reversa_sdd/prd.md#4-escopo-in` | Definição do escopo funcional do MVP e modelo offline-first sem anúncios | 🟡 |
| `_reversa_sdd/sdd/puzzle-engine.md#6-requisitos-funcionais` | Validação das 4 regras lógicas e geração com garantia de solução única | 🟡 |
| `_reversa_sdd/sdd/gameplay-ui.md#6-requisitos-funcionais` | Interface mobile-first com toques alternados, feedback visual e tema acolhedor | 🟡 |
| `_reversa_sdd/sdd/progression-storage.md#6-requisitos-funcionais` | Armazenamento local (IndexedDB) e backup exportável em arquivo JSON | 🟡 |
| `_reversa_sdd/sdd/pwa-offline-shell.md#6-requisitos-funcionais` | Casca PWA offline (Service Worker Cache-First), áudio Web Audio e Dockerfile K3s | 🟡 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---|---|---|
| **Alexandre** (Mestre da Lógica) | Resolver tabuleiros desafiadores sem quebras de foco | Joga em tabuleiros $8\times8$, sem anúncios, acompanhando recordes de tempo e eficiência. |
| **Mariana** (Jogadora Casual) | Desestressar e relaxar antes de dormir | Joga sessões consecutivas com sons confortantes de patinhas e visual fofo de filhotes. |
| **Lucas** (Iniciante Curioso) | Aprender a mecânica de dedução intuitivamente | Descobre as regras através de alertas visuais suaves de conflito ao tocar nas células. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Unicidade por Linha):** Cada linha da grade deve conter exatamente 1 cachorrinho no tabuleiro resolvido. 🟡
2. **RN-02 (Unicidade por Coluna):** Cada coluna da grade deve conter exatamente 1 cachorrinho no tabuleiro resolvido. 🟡
3. **RN-03 (Unicidade por Região):** Cada região colorida conexa deve conter exatamente 1 cachorrinho no tabuleiro resolvido. 🟡
4. **RN-04 (Espaço Pessoal Canino):** Nenhum cachorrinho pode ocupar uma célula adjacente (seja ortogonal ou diagonal) a outro cachorrinho. 🟡
5. **RN-05 (Garantia de Solução Única):** Todo tabuleiro apresentado ao jogador deve possuir rigorosamente 1 solução matemática válida comprovada por resolvedor determinístico. 🟡
6. **RN-06 (Integridade de Backup):** A restauração de dados via arquivo JSON só pode ser aplicada se o schema da versão e checksum forem válidos. 🟡

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|---|---|---|---|---|
| 🟡 RF-01 | O sistema deve renderizar o tabuleiro de jogo em grade $N \times N$ com regiões coloridas contrastadas e responsivas. | Must | Exibir grade centralizada em telas mobile de 320px a 1080px sem corte lateral. | 🟡 |
| 🟡 RF-02 | O usuário deve poder alternar o estado das células entre vazio, bloqueado (ossinho de apoio) e ocupado (cachorrinho). | Must | Toque simples marca ossinho; segundo toque coloca cachorrinho; terceiro toque limpa a célula. | 🟡 |
| 🟡 RF-03 | O sistema deve validar em tempo real as jogadas e destacar em tom suave de alerta células envolvidas em infrações de regras. | Must | Destacar células conflitantes imediatamente após a jogada em tempo de resposta < 16ms. | 🟡 |
| 🟡 RF-04 | O sistema deve detectar a condição de vitória e exibir tela comemorativa limpa com botão para avançar para a próxima fase. | Must | Disparar animação suave do cachorrinho e atualizar histórico sem transição para anúncios. | 🟡 |
| 🟡 RF-05 | O sistema deve persistir localmente o progresso das fases, estatísticas de jogo e recordes de tempo. | Must | Recarregar a página ou fechar o app e constatar que o progresso permanece intacto. | 🟡 |
| 🟡 RF-06 | O usuário deve poder exportar e importar arquivo JSON de backup contendo todo o seu histórico e configurações. | Must | Baixar arquivo de backup em um aparelho e restaurar com sucesso em outro navegador. | 🟡 |
| 🟡 RF-07 | O sistema deve funcionar 100% offline através de Service Worker após o primeiro carregamento da aplicação. | Must | Operar em modo avião sem falhas de carregamento de páginas, imagens ou sons. | 🟡 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|---|---|---|---|
| Desempenho | Taxa de atualização constante de 60 FPS e resposta ao toque < 16ms | Evita sensação de lentidão no mobile e garante relaxamento visual contínuo. | 🟡 |
| Disponibilidade | 100% dos recursos estáticos e lógicos operando offline | Permite jogar no metrô, viagens ou áreas sem cobertura de rede celular. | 🟡 |
| Infraestrutura | Imagem Docker Alpine < 25MB com consumo de RAM < 20MB | Permite deploy eficiente e econômico no cluster K3s do homelab residencial. | 🟡 |
| Privacidade | Zero cookies invasivos, zero anúncios e telemetria externa desativada | Conformidade total por design e proteção da privacidade familiar. | 🟡 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Posicionamento bem-sucedido de cachorrinho sem conflitos
  Dado que o jogador está em uma fase ativa de dimensão 6x6
  Quando ele toca na célula da linha 2, coluna 4 desocupada
  Então o sistema renderiza a ilustração do cachorrinho acomodado
  E nenhuma célula adjacente ou linha/coluna exibe aviso de conflito

Cenário: Detecção de conflito de espaço diagonal
  Dado que já existe um cachorrinho na linha 1, coluna 1
  Quando o jogador tenta colocar outro cachorrinho na linha 2, coluna 2
  Então o sistema posiciona o cachorrinho mas destaca ambas as células em cor suave de alerta
  E o status de vitória permanece bloqueado até a resolução do conflito

Cenário: Exportação de backup da conta
  Dado que o jogador possui 15 fases concluídas e 3 recordes registrados
  Quando ele acessa as configurações e toca em "Fazer Backup"
  Então o navegador faz o download imediato de um arquivo JSON leve com o histórico completo
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|---|---|---|
| Motor de regras e geração (RF-01, RF-02, RF-03) | Must | Funcionalidade central de jogabilidade sem a qual o quebra-cabeça não existe. |
| Tela de vitória e progressão contínua (RF-04, RF-05) | Must | Ciclo básico de engajamento do jogador. |
| Exportação e importação de backup JSON (RF-06) | Must | Requisito explícito do usuário para segurança do progresso da conta. |
| PWA offline e Service Worker (RF-07) | Must | Requisito inegociável de independência de conexão e deploy K3s. |

---

## 9. Esclarecimentos

> Nenhuma dúvida aberta pendente. Todas as decisões de arquitetura e escopo foram estabelecidas no PRD e nas especificações SDD.

---

## 10. Lacunas

- Nenhuma lacuna bloqueadora identificada (0 marcadores `[DÚVIDA]`).

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|---|---|---|
| 2026-10-25 | Versão inicial gerada por `/reversa-requirements` | reversa |
