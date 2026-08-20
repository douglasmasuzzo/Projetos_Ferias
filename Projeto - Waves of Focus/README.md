# Waves of Focus

Ambiente visual e sonoro de foco/relaxamento, com múltiplos ambientes selecionáveis, player customizado (play/pause + volume) e preferências salvas automaticamente.

## Funcionalidades

- **Seletor de ambientes**: 4 opções (Céu Lofi, Cidade à noite com chuva, Chuva Lofi, Cyberpunk neon), cada uma com vídeo/áudio e gradiente de fundo próprios
- **Player customizado**: controle de play/pause e volume via YouTube IFrame API, sem depender dos controles nativos do player embutido
- **Persistência**: última escolha de ambiente e nível de volume salvos no `localStorage` — mantidos ao recarregar a página

## Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) para controle programático do player
- CSS puro (glassmorphism, gradientes dinâmicos por ambiente)

## Como rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  components/
    FocusPlayer.jsx         # Componente raiz: player + controles + seletor
    PlayerControls.jsx      # Play/pause e volume
    EnvironmentSelector.jsx # Chips de seleção de ambiente
  hooks/
    useYouTubePlayer.js     # Integração com a YouTube IFrame API
    useLocalStorage.js      # Persistência de preferências
  constants.js               # Lista de ambientes (vídeo + gradiente)
  App.jsx / App.css
  main.jsx / index.css
```

## Possíveis evoluções

- Temporizador Pomodoro sobreposto ao player
- Modo tela cheia dedicado
- Adicionar sons ambiente adicionais (mixáveis, não só um vídeo por vez)
- Migrar de gradientes CSS para imagens de fundo próprias por ambiente
