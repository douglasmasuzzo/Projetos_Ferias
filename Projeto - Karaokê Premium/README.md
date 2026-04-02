# 🎤 **Projeto - Karaokê Premium** 

Um motor de karaokê via terminal que sincroniza áudio do YouTube com letras em tempo real (LRC), utilizando o player MPV para processamento de áudio e uma interface rica no console.

## ✨ Funcionalidades

- **Busca Automática:** Localiza áudios oficiais no YouTube e letras sincronizadas na nuvem.
- **Interface Terminal (TUI):** Layout estilizado com barra de progresso, cores e exibição da letra atual e próxima estrofe.
- **Sincronização via IPC:** Comunicação direta com o motor do MPV através de *Named Pipes* para precisão de milissegundos.
- **Controles Integrados:** Suporte a pausa, pulo de trechos e ajuste de volume diretamente pelo player MPV.
- **Modo Minimalista:** Foco total na letra no terminal enquanto o áudio roda em segundo plano.

## 🚀 Pré-requisitos

Para rodar o projeto, você precisará de:

1.  **Python 3.8+**
2.  **MPV Player:** Recomendado o [mpv.net](https://github.com/mpvnet-player/mpv.net) para Windows.
3.  **yt-dlp:** Necessário para o MPV conseguir extrair áudio do YouTube.

## 🛠️ Instalação

1.  Clone este repositório.
2.  Instale as dependências do Python:
    ```bash
    pip install syncedlyrics python-dotenv
    ```
3.  Certifique-se de que o `yt-dlp` está instalado no seu sistema (ou acessível pelo MPV).

## ⚙️ Configuração

Crie ou edite o arquivo `.env` na raiz do projeto para apontar para o seu executável do MPV:

```env
MPV_PATH="C:\Caminho\Para\Seu\mpvnet.exe"
```

## 📖 Como Usar

1. Execute o script principal:
   ```bash
   python script.py
   ```
2. Digite o **Nome do Artista**.
3. Digite o **Nome da Música**.
4. O sistema buscará a melhor versão do áudio e a letra correspondente.
5. **Divirta-se!** 🎵

### Controles (Na janela do MPV):
- `Espaço`: Pausar/Retomar.
- `Setas`: Avançar ou retroceder na música.
- `9` e `0`: Ajustar volume.

## 🛠️ Tecnologias Utilizadas

- **Python:** Lógica principal e Interface de Terminal.
- **MPV:** Motor de áudio e comunicação IPC.
- **SyncedLyrics:** Biblioteca para busca de letras LRC.
- **JSON IPC:** Protocolo de comunicação entre o script e o player.

---
*Desenvolvido para amantes de música que preferem a simplicidade e o poder do terminal.*
