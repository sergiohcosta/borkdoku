# Onboarding: Borkdoku Core MVP

> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  

---

## 1. Como Executar em Desenvolvimento Local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento Vite:
   ```bash
   npm run dev
   ```
3. Abra a URL exibida (ex: `http://localhost:5173`) no navegador do desktop ou no smartphone (via IP local da sua rede Wi-Fi).

---

## 2. Roteiro de Validação e Teste da Jogabilidade

1. **Jogando a Primeira Fase:**
   - Observe a grade com regiões coloridas suaves.
   - Toque em uma célula vazia para marcar um ossinho de bloqueio (eliminação de possibilidade).
   - Dê um segundo toque na mesma célula (ou alterne para o modo cachorrinho na barra inferior) para posicionar o cachorrinho.
   - Coloque um cachorrinho tocando diagonalmente outro para verificar o destaque visual de aviso.
   - Complete o tabuleiro com todos os cachorrinhos sem infrações e observe a tela de vitória limpa.

2. **Testando o Modo 100% Offline (PWA):**
   - No celular ou Chrome, clique no botão "Instalar" ou "Adicionar à Tela de Início".
   - Ative o modo avião no dispositivo.
   - Abra o app Borkdoku e jogue normalmente: constate que os sons, gráficos e fases operam com 100% de disponibilidade.

3. **Testando Backup e Restauração:**
   - Conclua pelo menos uma fase.
   - Acesse o ícone de engrenagem e clique em "Fazer Backup".
   - Verifique que o download do arquivo `borkdoku-backup-*.json` foi concluído.
   - Abra uma janela anônima, acesse a mesma tela de configurações e clique em "Restaurar Backup", selecionando o arquivo gerado.
   - Constatar que as fases concluídas e estatísticas são recuperadas imediatamente.

---

## 3. Deploy no Cluster K3s do Homelab

1. Construir a imagem Docker:
   ```bash
   docker build -t borkdoku:1.0.0 .
   ```
2. Aplicar os manifestos Kubernetes no K3s:
   ```bash
   kubectl apply -f k8s/
   ```
3. Acessar o serviço através do Ingress ou NodePort configurado na sua rede local.
