# Spec: pwa-offline-shell (Service Worker, Assets de Áudio e Deploy K3s)

> Selo 🟡 PLANEJADO em todos os itens. Documento gerado pelo time Code New Project Agents.

**Versão:** 1.0  
**Status:** Rascunho  
**Autor:** reversa-spec-sdd  
**Data:** 2026-10-25  
**Reviewers:** Sergio  

---

## 1. Resumo

🟡 O componente `pwa-offline-shell` fornece a infraestrutura de empacotamento, ciclo de vida offline e entrega do Borkdoku. Ele implementa o manifesto PWA para instalação na tela inicial de celulares, Service Worker com estratégia Cache-First para disponibilidade 100% offline, sintetizador/gerenciador de áudios suaves de efeitos sonoros com Web Audio API e imagem de container Nginx Alpine otimizada para deploy no cluster K3s do home office.

---

## 2. Contexto e Motivação

🟡 **Problema:** Aplicativos web tradicionais falham completamente quando o smartphone entra em modo avião, perde o sinal de internet ou se o servidor remoto oscilar, quebrando a experiência de quem joga no metrô ou em viagens.

🟡 **Evidências:** Jogadores buscam jogos casuais para passar o tempo offline; a dependência constante de conexão é uma das maiores queixas nas avaliações do Meowdoku original e de jogos similares.

🟡 **Por que agora:** O usuário definiu como requisito inegociável a capacidade de rodar 100% offline e com deploy independente no seu próprio cluster K3s residencial.

---

## 3. Goals (Objetivos)

- [ ] 🟡 G-01: Assegurar disponibilidade de 100% dos recursos do jogo sem conexão ativa com a internet após o primeiro acesso.
- [ ] 🟡 G-02: Atingir tempo de carregamento inicial (First Contentful Paint) < 1.5s em redes 4G móveis e < 300ms em acessos subsequentes em cache.
- [ ] 🟡 G-03: Manter o tamanho final da imagem de container Docker < 25MB para deploy rápido e leve no K3s.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---|---|---|---|
| 🟡 Disponibilidade em modo offline | 0% | 100% | 15 dias |
| 🟡 Tempo de carregamento com Service Worker | N/A | < 300ms | 15 dias |
| 🟡 Tamanho da imagem Docker (Nginx Alpine) | N/A | < 25MB | 15 dias |

---

## 4. Non-Goals (Fora do Escopo)

- 🟡 NG-01: O componente não inclui backend dinâmico em NodeJS, Python ou banco relacional centralizado (a entrega é puramente estática).
- 🟡 NG-02: O componente não faz publicação em lojas proprietárias (Google Play Store ou Apple App Store) no MVP.
- 🟡 NG-03: O componente não implementa streaming de músicas externas ou bibliotecas pesadas de áudio que aumentem o bundle.

---

## 5. Usuários e Personas

🟡 **Usuário primário:** Alexandre (Mestre dos Puzzles), que joga no metrô subterrâneo sem sinal de celular e exige carregamento instantâneo.  
🟡 **Usuário secundário:** Mariana (A Jogadora Casual), que instala o ícone do cachorrinho diretamente na tela de início do seu smartphone para abrir com um toque como se fosse um app nativo.

**Jornada atual (sem a feature):** O usuário abre a página web sem rede e se depara com a tela de dinossauro sem internet do navegador.  
**Jornada futura (com a feature):** O usuário clica no ícone do Borkdoku no celular e o jogo abre imediatamente em tela cheia, com sons e fases completas, sem consumir nenhum dado móvel.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| 🟡 RF-01 | O sistema deve disponibilizar um `manifest.webmanifest` válido contendo nome 'Borkdoku', ícones de 192x192 e 512x512, modo de exibição `standalone` e orientação preferencial retrato. | Must | Validar com Lighthouse PWA Audit conformidade de 100% e prompt de instalação nativo no Chrome/Safari. |
| 🟡 RF-02 | O sistema deve registrar um Service Worker que realiza o precache automático de todos os arquivos estáticos (HTML, CSS, JS, manifest, ícones SVG e sons) no evento de instalação. | Must | Ativar modo avião no dispositivo após a primeira visita e verificar que o jogo carrega e opera perfeitamente. |
| 🟡 RF-03 | O sistema deve implementar estratégia Cache-First com atualização em background (Stale-While-Revalidate) para permitir que novas versões do jogo sejam instaladas sem travar a sessão ativa. | Must | Atualizar a versão dos assets no servidor e constatar que o Service Worker detecta a nova versão e aplica na próxima inicialização. |
| 🟡 RF-04 | O sistema deve implementar reprodutor de efeitos sonoros suaves (patinha no tabuleiro, ossinho de apoio e latidinho carinhoso de vitória) utilizando Web Audio API nativa. | Must | Disparar ações de jogo e verificar reprodução dos sons sem estalos, com latência imperceptível e volume equalizado. |
| 🟡 RF-05 | O usuário deve poder ativar ou silenciar todos os efeitos sonoros através de um botão de alternância de mudo visível no cabeçalho. | Must | Tocar no ícone de som e confirmar que nenhum áudio é emitido quando o estado for mudo. |
| 🟡 RF-06 | O sistema deve fornecer um Dockerfile multi-stage baseado em `nginx:alpine` gerando uma imagem de container estática com headers adequados de cache e compressão gzip. | Must | Compilar a imagem Docker, rodar localmente e verificar resposta HTTP 200 na porta configurada com consumo de memória < 20MB. |
| 🟡 RF-07 | O sistema deve fornecer manifesto de deploy Kubernetes (Deployment e Service) pronto para aplicação direta via `kubectl apply -f` no cluster K3s do homelab. | Should | Aplicar os manifestos em namespace de teste no K3s e verificar pods em estado `Running` com readiness probe atendida. |

### 6.2 Fluxo Principal (Happy Path)

1. O usuário acessa a URL do Borkdoku no navegador do smartphone via rede local ou domínio do K3s.
2. O navegador recebe os assets compilados e o Service Worker realiza o download e cache de todos os recursos essenciais.
3. O navegador apresenta a notificação nativa de instalação ("Adicionar Borkdoku à Tela de Início").
4. O usuário adiciona o ícone na tela inicial e abre o aplicativo em modo standalone (tela cheia sem barra de endereços).
5. O usuário coloca o aparelho em modo avião e continua jogando todas as fases com sons e respostas instantâneas.

### 6.3 Fluxos Alternativos

**Fluxo Alternativo A — Nova versão disponibilizada no cluster K3s:**
1. Uma nova versão do container é publicada no K3s.
2. O Service Worker no cliente detecta a alteração no arquivo de hash de assets em segundo plano.
3. O sistema exibe um aviso sutil na interface: "Nova versão disponível. Toque para atualizar".
4. O usuário toca na mensagem e a página é recarregada suavemente com os novos recursos.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|---|---|---|---|
| 🟡 RNF-01 | Consumo de memória RAM do container Nginx | < 20MB | Uso de Nginx Alpine sem módulos dinâmicos desnecessários. |
| 🟡 RNF-02 | Nota no Lighthouse PWA Audit | $\ge 95/100$ | Verificação completa de boas práticas e Service Worker. |
| 🟡 RNF-03 | Latência de inicialização de áudio Web Audio API | < 5ms | Sons sintetizados proceduralmente ou pré-decodificados em buffers de memória. |

---

## 8. Design e Interface

🟡 **Arquitetura da Casca PWA e Áudio:**
- `service-worker.ts`: Ciclo de vida de cache, ativação e limpeza de caches obsoletos.
- `SoundManager`: Classe utilitária encapsulando `AudioContext`, pré-carregamento de buffers de áudio e respeitando política de autoplay do navegador mediante primeiro toque.
- `k8s/`: Diretório contendo manifesto declarativo `deployment.yaml` e `service.yaml`.

---

## 9. Modelo de Dados

```typescript
export interface ServiceWorkerConfig {
  cacheName: string; // ex: 'borkdoku-v1.0.0'
  precacheAssets: string[];
}

export type SoundEffectType = 'place_dog' | 'place_bone' | 'remove' | 'victory' | 'error_conflict';

export interface AudioSettings {
  soundEnabled: boolean;
  masterVolume: number; // 0.0 a 1.0
}
```

---

## 10. Integrações e Dependências

🟡 **Dependências e Ferramentas:**
- Servidor web estático Nginx Alpine.
- APIs nativas de navegadores modernos: Service Worker API, CacheStorage API, Web Audio API.
- Cluster Kubernetes K3s para hospedagem do container via Ingress ou NodePort.

---

## 11. Edge Cases e Cenários de Erro

| ID | Cenário / Gatilho | Comportamento Esperado do Sistema |
|---|---|---|
| 🟡 EC-01 | Falha de conectividade ou rede indisponível durante o primeiro acesso | O Service Worker não consegue registrar todos os assets, exibe mensagem amigável solicitando recarregar quando a conexão retornar e não polui o cache incompleto. |
| 🟡 EC-02 | Política de restrição de Autoplay do navegador bloqueando inicialização do áudio | O `SoundManager` mantém o `AudioContext` em estado suspenso até o primeiro toque do usuário na tela, ativando os sons suavemente sem lançar erro no console. |
| 🟡 EC-03 | Pod do K3s reiniciado ou indisponibilidade temporária de rede no homelab | Como todos os assets já foram armazenados no Service Worker do cliente, o jogador continua jogando normalmente sem interrupções. |
| 🟡 EC-04 | Cache corrompido ou versão antiga de asset travada no Service Worker | O sistema fornece mecanismo interno de auto-recuperação (fallback de desregistro e recriação do cache em caso de erro 404 em assets vitais). |

---

## 12. Segurança e Privacidade

🟡 O container Nginx opera em modo somente-leitura com usuário não-root (`nginx` sem privilégios de superusuário), garantindo conformidade e segurança da infraestrutura do homelab.

---

## 13. Plano de Rollout e Rollback

🟡 **Rollout:** Build de imagem Docker com tag semântica (ex: `borkdoku:1.0.0`) e deploy no K3s com estratégia de atualização RollingUpdate.  
🟡 **Rollback:** Caso ocorra regressão no bundle frontend, execução imediata de `kubectl rollout undo deployment/borkdoku` retornando à versão anterior em menos de 10 segundos.

---

## 14. Open Questions

- 🟡 OQ-01: ⚠️ ABERTO: Devemos expor métricas Prometheus no Nginx para monitoramento de tráfego no cluster K3s?

---

## Relatório de Avaliação de Qualidade

```
============================================================
  SPEC QUALITY REPORT
  Arquivo: _reversa_sdd/sdd/pwa-offline-shell.md
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

Gerado por reversa-spec-sdd em 2026-10-25T12:07:00Z  
Fonte: prd.md
