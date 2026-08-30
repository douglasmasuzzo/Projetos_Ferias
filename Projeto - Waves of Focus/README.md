# Waves of Focus

Rádio de ambientes visuais e sonoros para foco e relaxamento. O app apresenta **4 estações**, cada uma com vídeo/áudio próprio (via YouTube IFrame API), gradiente de fundo exclusivo e preferências salvas localmente.

## Estações

| Estação | Vídeo | Status (verificado em 08/2026) |
| --- | --- | --- |
| Céu Lofi | **Above the Clouds** — Fantasy Lofi Lounge | ✅ playable / embeddable |
| Cidade à noite (chuva) | **90's Tokyo Street • Rainy Lofi** — Lofi on the Rooftop | ✅ playable / embeddable |
| Chuva Lofi | **Lofi Rain Ambience** — 90's City Night | ✅ playable / embeddable |
| Cyberpunk (chuva neon) | **Neon Cyberpunk City Rain** — Lofi Ambient | ✅ playable / embeddable |

> As estações 1 e 2 usavam vídeos com `playabilityStatus: UNPLAYABLE` (URLs fora do ar —
> `jfKfPfyJRdk` e `Q9SdxeUNzVg`). Foram **substituídas** por transmissões verificadas e
> incorporáveis.

## Funcionalidades

- **Player dividido por estações**: prev/next com wraparound, chips de seleção e atalhos de teclado (`Espaço` play/pause, `←`/`→` trocar estação)
- **Player customizado**: play/pause, volume com mute, sem depender dos controles nativos do embed
- **Tratamento de erros**: estados de *carregando*, *pausado* (autoplay bloqueado) e *falha na estação* com opção de "Tentar novamente" — nada de player preto silencioso
- **Metadados**: nome da estação, título e artista do vídeo + link "Assistir no YouTube"
- **Persistência**: estação e volume salvos no `localStorage`
- **Acessibilidade**: overlays com `role`/`aria`, foco visível e suporte a `prefers-reduced-motion`

## Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- CSS puro (glassmorphism, gradientes por ambiente)

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

## Qualidade

```bash
npm run lint   # ESLint 9 (flat config)
```

## Estrutura

```
src/
  components/
    FocusPlayer.jsx         # Orquestrador: estações, navegação, atalhos
    PlayerFrame.jsx         # Moldura do player + overlays (loading/pause/erro)
    PlayerControls.jsx      # Play/pause, prev/next, volume + mute
    EnvironmentSelector.jsx # Chips de seleção de estação
    icons.jsx               # Ícones SVG (sem dependências externas)
  hooks/
    useYouTubePlayer.js     # Integração robusta com a YouTube IFrame API
    useLocalStorage.js      # Persistência de preferências
  constants.js              # Catálogo de estações (vídeo, título, gradiente)
  App.jsx / App.css
  main.jsx / index.css
public/
  favicon.svg               # Favicon original (waves)
```

## Observações

- Para **validar futuramente** a saúde de uma estação, confira o `playabilityStatus` na
  página de watch/embed do vídeo antes de trocar o `videoId` em `src/constants.js`.
- O app já está preparado para falhas: se um vídeo sair do ar, a estação mostra uma mensagem
  clara com o motivo e a ação "Tentar novamente".

## Possíveis evoluções

- Temporizador Pomodoro sobreposto ao player
- Modo tela cheia dedicado
- Sondagem automática das estações (health check) com badge de "fora do ar"
- Sons ambiente adicionais mixáveis (não só um vídeo por vez)