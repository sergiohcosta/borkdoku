# Borkdoku 🐶🐾

> **O quebra-cabeça de lógica relaxante com gatinhos e cachorrinhos — 100% livre de anúncios, offline-first e aconchegante (*cozy*).**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline-success.svg)](https://web.dev/progressive-web-apps/)
[![Ad-Free](https://img.shields.io/badge/Ads-0%25%20Zero%20Propagandas-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🐕 Sobre o Borkdoku

O **Borkdoku** nasceu de uma dor real: jogos mobile relaxantes de quebra-cabeça (puzzles no estilo *Queens* / *Star Battle*) são divertidos e estimulantes, mas frequentemente arruinados por monetização predatória — vídeos em tela cheia forçados a cada vitória, sons estridentes e exigência de internet para jogar.

O **Borkdoku** resgata a experiência pura e acolhedora:
- 🚫 **Zero Anúncios:** Nenhuma propaganda, banner ou vídeo forçado. Nunca.
- 🐾 **Estética Cozy Canina:** Paleta suave de cores, ilustrações fofas de cachorrinhos e efeitos sonoros relaxantes via Web Audio API.
- 📴 **100% Offline-First:** Funciona em modo avião, no metrô ou em viagens via Service Worker. Pode ser instalado na tela de início do celular (PWA) como um app nativo.
- 🧠 **Dedução Pura com Soluções Únicas:** Solver matemático baseado em backtracking que garante que todo tabuleiro possui exatamente **uma única solução válida**, sem adivinhações.
- 💾 **Soberania dos Seus Dados:** Sem login obrigatório e sem nuvem de terceiros. Seu histórico fica no seu aparelho, com botão de **Exportar/Restaurar Backup JSON** para trocar de celular sem perder nada.
- 🌙 **Modo Noturno:** Tema escuro calibrado para jogar na cama ou no sofá antes de dormir.

---

## 🧩 Regras do Jogo

O objetivo é colocar exatamente um cachorrinho em cada linha, coluna e região colorida do tabuleiro, respeitando o espaço pessoal canino:

1. **Regra da Linha:** Exatamente 1 cão por linha horizontal.
2. **Regra da Coluna:** Exatamente 1 cão por coluna vertical.
3. **Regra da Região:** Exatamente 1 cão por região colorida.
4. **Espaço Pessoal (Adjacência):** Cães são territoriais e precisam de espaço — **nenhum cão pode tocar outro, nem mesmo na diagonal!**

### 🎮 Controles Mobile-First
- **Toque único:** Marca um **ossinho 🦴** para eliminar casas onde você deduziu que não pode haver cão.
- **Segundo toque:** Posiciona o **cachorrinho 🐶**.
- **Terceiro toque:** Limpa a célula.
- **Barra de atalhos inferior:** Permite alternar rapidamente entre o *Modo Cachorrinho*, *Modo Ossinho* ou *Modo Alternância*.

---

## 🏆 Raças Colecionáveis

A cada marco de fases concluídas, você desbloqueia uma nova raça canina no seu álbum

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** TypeScript puro (Vanilla TS), HTML5 semântico e Tailwind/CSS moderno.
- **Build & Dev:** [Vite](https://vitejs.dev/) (build ultrarrápido em ~300ms, bundle final com apenas ~7.5 KB gzipped).
- **Áudio:** Web Audio API nativa com síntese de frequências suaves (sem arquivos de áudio pesados).
- **PWA & Offline:** Service Worker com estratégia *Cache-First* e Web App Manifest.
- **Container & K3s:** Imagem multi-stage `node:alpine` + `nginx:alpine` (< 20MB) pronta para Kubernetes homelab.
- **Testes:** Bateria de testes unitários integrados com Node Test Runner (`src/**/*.test.ts`).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado.

### 1. Clonar e Instalar
```bash
git clone https://github.com/sergiohcosta/borkdoku.git
cd borkdoku
npm install
```

### 2. Rodar em Desenvolvimento
```bash
npm run dev
```
Abra `http://localhost:5173` no navegador ou acesse pelo IP da sua rede local no smartphone!

### 3. Executar os Testes Unitários
```bash
npm test
```

### 4. Gerar Build de Produção
```bash
npm run build
```

---

## 🐳 Deploy com Docker

### Rodando via Docker
```bash
# Compilar a imagem leve
docker build -t borkdoku:1.0.0 .

# Executar na porta 8080
docker run -d -p 8080:80 --name borkdoku borkdoku:1.0.0
```

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE). Feito com carinho para quem ama quebra-cabeças e cachorrinhos! 🐾
