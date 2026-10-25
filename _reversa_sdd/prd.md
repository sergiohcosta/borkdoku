# PRD: Borkdoku

> Selo 🟡 PLANEJADO. Documento gerado a partir de ideation + personas.

**Versão:** 1.0  
**Data:** 2026-10-25T12:00:30Z  
**Autor:** reversa-drafter  
**Status:** rascunho  

---

## 1. Problema

🟡 Jogadores que buscam momentos de foco, descompressão e raciocínio lógico no celular através de jogos no estilo Queens / Star Battle (como o Meowdoku) sofrem com constante frustração causada por monetização agressiva: vídeos publicitários forçados e barulhentos a cada vitória ou reinício, interfaces poluídas e exigência de conexão à internet, que quebram o estado de relaxamento (*zen*) e o ritmo do raciocínio analítico.

### Quem sente
🟡 
- **Entusiastas de quebra-cabeças lógicos** que jogam em pausas do trabalho ou no transporte e têm seu fluxo de pensamento quebrado por anúncios invasivos.
- **Jogadores casuais e pessoas queridas (como a esposa)** que amam a mecânica de dedução do jogo mas abandonam ou reduzem o uso pelo cansaço mental gerado pela poluição comercial.
- **Iniciantes e novos jogadores** que procuram um passatempo fofo, acolhedor e leve, sem pegadinhas de compras acidentais ou vídeos apelativos.

---

## 2. Personas-alvo

🟡 Referência completa em [`personas.md`](./personas.md). Resumo:

- **Alexandre (O Mestre dos Desafios Lógicos)**: 🟡 Avançado em lógica dedutiva. Dor: quebra de foco por propagandas e ausência de métricas de eficiência. Objetivo: resolver tabuleiros complexos com precisão e acompanhar estatísticas de tempo.
- **Mariana (A Jogadora Casual em Busca de Descompressão)**: 🟡 Intermediária em puzzles, busca estética acolhedora (*cozy*). Dor: anúncios estridentes que destroem o momento de relaxamento no sofá ou antes de dormir. Objetivo: desacelerar com cachorrinhos fofos e sons relaxantes em sessões contínuas.
- **Lucas (O Jogador Iniciante / Curioso)**: 🟡 Iniciante atraído pelo carisma canino. Dor: penalidades punitivas e frustração ao não compreender regras espaciais. Objetivo: aprender intuitivamente através de feedbacks visuais claros e progressão recompensadora.

---

## 3. Métricas de sucesso

🟡 Indicadores de validação e engajamento para os primeiros 3 meses de uso:

| Métrica | Unidade | Alvo | Prazo |
|---|---|---|---|
| 🟡 Jogabilidade Individual (Criador) | Partidas concluídas/dia | ≥ 5 partidas diárias sem travamentos ou tédio | 30 dias |
| 🟡 Retenção da Jogadora Casual (Esposa) | Frequência e duração de sessão | Sessões prolongadas semanais sem frustração ou desistência | 60 dias |
| 🟡 Desempenho e Leveza | Tempo de carregamento inicial (PWA) | < 1,5 segundos em mobile, 60 FPS estáveis | 30 dias |
| 🟡 Autonomia Offline | Disponibilidade sem rede | 100% funcional offline (inclusive cache de assets e áudio) | 15 dias |
| 🟡 Confiabilidade do Gerador de Puzzles | Taxa de tabuleiros com solução única | 100% de unicidade e validade lógica | 15 dias |

---

## 4. Escopo (in)

🟡 Funcionalidades essenciais do MVP e evolução imediata:

- 🟡 **Mecânica Central Queens / Star Battle:** Tabuleiro dividido em regiões coloridas distintas. Regra: exatamente 1 cachorrinho por linha, coluna e região, com restrição de espaço pessoal (cachorrinhos não se tocam, nem na diagonal).
- 🟡 **Ferramentas de Interação e Dedução:**
  - Toque único para marcar/desmarcar bloqueio de apoio (ossinho / patinha de eliminação);
  - Toque duplo ou alternador de modo para posicionar o cachorrinho;
  - Feedback visual automático de casas bloqueadas e detecção imediata de conflitos.
- 🟡 **Arquitetura PWA 100% Offline:** Service Worker moderno com estratégia Cache-First para todos os assets (HTML, CSS, JS, ícones, SVGs e áudios), permitindo instalação na tela inicial ("Add to Home Screen").
- 🟡 **Catálogo e Progressão de Fases:**
  - Trilha contínua de fases com curvas de dificuldade progressivas (tabuleiros de 5x5 até 8x8/9x9);
  - Modo desafio diário com seed compartilhado.
- 🟡 **Persistência Local e Backup:**
  - Armazenamento em IndexedDB / LocalStorage para fases concluídas, tempos, erros e colecionáveis;
  - Mecanismo de exportação (download de arquivo JSON de backup) e importação (restauração de progresso).
- 🟡 **Identidade Visual e Sensorial Acolhedora (*Cozy Dog Aesthetic*):**
  - Paleta de cores suaves e contrastes acessíveis nas regiões do tabuleiro;
  - Ilustrações fofas de cachorrinhos de diferentes raças;
  - Efeitos sonoros suaves e confortantes (latidinhos delicados de vitória, patinhas tocando o chão, abanar de cauda) com controle de mudo.
- 🟡 **Painel de Estatísticas Pessoais:** Total de partidas jogadas, taxa de vitória, menor tempo por tamanho de grade e sequência atual (*streak*).

---

## 5. Não-objetivos (out)

🟡 O que está explicitamente FORA do escopo da versão inicial:

- 🟡 **Zero Anúncios:** Nenhuma inclusão de SDKs de publicidade (AdMob, Unity Ads, pop-ups ou banners promocionais).
- 🟡 **Sem Paywalls ou Compras Forçadas:** Nenhuma barreira que trave fases atrás de microtransações (arquitetura desacoplada apenas para futura monetização ética e opcional).
- 🟡 **Sem Login Social ou Nuvem Obrigatória:** O jogador não precisa criar conta com Google/Facebook nem fornecer e-mail para desfrutar de todas as fases.
- 🟡 **Sem Multiplayer em Tempo Real:** Foco total no relaxamento e raciocínio individual, sem pressão competitiva síncrona.

---

## 6. Restrições

🟡 Parâmetros técnicos, operacionais e de conformidade:

| Tipo | Descrição |
|---|---|
| 🟡 Técnica (Frontend) | Web / PWA moderno construído em HTML5, CSS3/Tailwind e TypeScript/JavaScript nativo, sem dependências pesadas de engines externas que aumentem o bundle desnecessariamente. |
| 🟡 Técnica (Infraestrutura) | Imagem de container Docker ultraleve (Nginx Alpine ou Caddy) pronta para deploy no cluster K3s do home office. |
| 🟡 Operacional (Offline) | 100% dos recursos estáticos e lógicos operam sem necessidade de conexão ativa com a internet. |
| 🟡 Compliance & Privacidade | Conformidade total por design (zero coleta de dados pessoais, sem cookies invasivos ou telemetria externa). |
| 🟡 Orçamento | Custo zero de manutenção de serviços externos na versão inicial (hospedagem no homelab próprio). |

---

## 7. Dependências externas

🟡 Dependências e serviços de terceiros:

- 🟡 **Nenhuma dependência externa em runtime:** O jogo é totalmente autocontido e roda localmente no cliente.
- 🟡 **Manifest & Service Worker:** Padrões abertos da web para compatibilidade com Chrome, Safari (iOS WebKit) e Firefox.

---

## 8. Riscos

🟡 Riscos mapeados e estratégias de mitigação:

| Risco | Impacto | Probabilidade | Mitigação proposta |
|---|---|---|---|
| 🟡 Tabuleiro gerado proceduralmente com múltiplas soluções válidas ou sem solução | Alto | Média | Desenvolver solver determinístico (backtracking) que valida rigorosamente se há exatamente uma única solução antes de apresentar a fase ao jogador, ou utilizar banco pré-validado de seeds de fases curadas. |
| 🟡 Comportamento de touch e gestos instável no Safari Mobile (iOS) | Médio | Média | Implementar prevenção de zoom acidental (`touch-action: manipulation`), viewport seguro (`dvh` e `safe-area-inset`) e testes dedicados em WebKit mobile. |
| 🟡 Perda de progresso ao limpar dados do navegador | Médio | Baixa | Oferecer de forma visível e simples o botão de "Backup de Progresso" (exportar JSON) e notificação sutil caso o armazenamento persistente do navegador não seja concedido. |
| 🟡 Sobrecarga visual ou fadiga de cores em tabuleiros grandes | Médio | Baixa | Escolher paletas harmônicas com contrastes testados para acessibilidade (WCAG) e permitir alternância de temas (claro, pastel, noturno). |

---

## 9. Critérios de aceite (alto nível)

🟡 Critérios baseados nas jornadas das personas principais:

- 🟡 **Critério 1 (Persona Alexandre — Eficiência & Foco):**
  - **Dado** que o jogador está em um tabuleiro 8x8 sem conexão com a internet,
  - **Quando** ele deduz e preenche todos os cachorrinhos sem cometer infrações de linha, coluna, região ou toque diagonal,
  - **Então** o jogo deve reconhecer a vitória imediatamente, exibir seu tempo exato e salvar os dados no histórico de estatísticas sem exibir qualquer propaganda ou interrupção.

- 🟡 **Critério 2 (Persona Mariana — Experiência Cozy & Sem Fricção):**
  - **Dado** que a jogadora completa uma fase no seu celular tarde da noite,
  - **Quando** ela toca no botão de próxima fase,
  - **Então** a transição deve ser imediata e silenciosa para o próximo desafio, mantendo a música suave/efeitos e o estado zen sem janelas modais invasivas.

- 🟡 **Critério 3 (Persona Lucas — Aprendizado & Feedback Claro):**
  - **Dado** que um jogador iniciante tenta colocar dois cachorrinhos que se tocam diagonalmente,
  - **Quando** o toque é realizado,
  - **Então** o jogo deve emitir um feedback visual sutil destacando a colisão espacial e orientando a regra sem penalizá-lo de forma abrupta.

- 🟡 **Critério 4 (Resiliência & Backup):**
  - **Dado** que o jogador quer trocar de aparelho ou garantir seu progresso,
  - **Quando** ele clica em "Exportar Backup",
  - **Então** um arquivo leve `borkdoku-backup.json` deve ser baixado instantaneamente, podendo ser importado em qualquer outro navegador para restaurar 100% das fases e recordes.

---

## Pendências de cobertura

🟡 Nenhuma pendência crítica identificada — todas as seções foram alimentadas e validadas a partir do `ideation.md`, `personas.md` e respostas de cobertura do usuário.

---

Gerado por reversa-drafter em 2026-10-25T12:00:30Z  
Fontes: ideation.md, personas.md
