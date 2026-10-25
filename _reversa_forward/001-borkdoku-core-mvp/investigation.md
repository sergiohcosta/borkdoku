# Investigation: Borkdoku Core MVP

> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  
> Referência: Queens Puzzle / Star Battle Logic  

---

## 1. Pesquisa de Fundo e Algoritmo de Resolução

O quebra-cabeça clássico **Queens** (popularizado recentemente pelo LinkedIn Games e por jogos como o Meowdoku) é uma variação das N-Rainhas com restrições regionais:
- Cada linha deve conter exatamente 1 rainha (ou cachorrinho);
- Cada coluna deve conter exatamente 1 cachorrinho;
- Cada região delimitada no tabuleiro deve conter exatamente 1 cachorrinho;
- Nenhuma peça pode ser vizinha ortogonal ou diagonal de outra peça (espaço pessoal).

### Análise de Complexidade e Solver
- Em tabuleiros de tamanho $5\times5$ até $9\times9$, o espaço de busca é reduzido ($\le 9^9$ nós antes de podas).
- Com poda de restrições (eliminando imediatamente linha, coluna e os 8 vizinhos ao posicionar uma peça), o algoritmo de **backtracking recursivo com bitmasks** resolve o tabuleiro completo em $< 5\text{ms}$ em qualquer navegador moderno.
- Para comprovar **unicidade de solução**, o solver não para ao achar a primeira solução: ele continua a busca até encontrar uma segunda solução ou esgotar a árvore. Se encontrar exatamente 1, o tabuleiro é certificado como único.

---

## 2. Padrões de Áudio e Usabilidade no Navegador

- **Web Audio API vs Tags `<audio>`:** Tags de áudio HTML5 sofrem de latência de inicialização e problemas de sincronia em navegadores móveis. A Web Audio API permite instanciar sintetizadores leves (ondas senoidais e ruído branco filtrado para cliques suaves de patinha e latidinhos fofos) sem transferir arquivos de áudio pela rede.
- **Prevenção de Toques Fantasmas no Mobile:** No iOS Safari e Chrome Android, cliques rápidos podem ser interpretados como duplo toque de zoom. O CSS `touch-action: manipulation` e a captura de eventos de ponteiro (`PointerEvent`) garantem latência zero de toque.

---

## 3. Estratégia de Cache PWA e Distribuição no K3s

- **Service Worker Stale-While-Revalidate com Precaching:** Durante a fase de build, um manifesto de hashes de arquivos estáticos é gerado. O Service Worker baixa todos no evento de `install`. Em acessos sem internet, os arquivos são entregues instantaneamente do CacheStorage.
- **K3s Homelab Deployment:** Um container Nginx Alpine rodando sem privilégios de root escuta na porta 80, servindo os arquivos estáticos pré-compilados pelo Vite com compressão gzip e cache headers imutáveis para assets versionados.
