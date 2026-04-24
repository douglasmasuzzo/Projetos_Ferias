# 🎤 **Projeto - Karaokê Premium (V2.1)** 

Um motor de karaokê via terminal de alta performance que sincroniza áudio do YouTube com letras em tempo real (LRC). Esta versão apresenta uma arquitetura modular robusta, persistência de sincronia e interface interativa.

## ✨ Funcionalidades

- **Arquitetura Modular:** Separação clara entre motor de sincronia (`core`), serviços de letras (`services`) e orquestração (`main.py`).
- **Busca Interativa:** Preview de letras antes da reprodução para garantir a versão correta (ex: Extended, Live, Studio).
- **Persistência de Offset (Sincronia):** Sistema inteligente que memoriza seus ajustes manuais por música em um banco de dados local (`offsets.json`).
- **Sincronização via IPC:** Comunicação via Named Pipes com o MPV para precisão de milissegundos.
- **Suite de Testes:** Validação automatizada da lógica de processamento de letras e engine de sincronia via Pytest.

## 📂 Estrutura do Projeto

- `main.py`: Ponto de entrada e interface do usuário.
- `core/`: 
  - `sync_engine.py`: Lógica matemática de sincronização.
  - `models.py`: Definições de dados (LyricLine, PlayerState, SyncState).
- `services/`: 
  - `lyrics_service.py`: Processamento e parsing de arquivos LRC.
- `tests/`: Suite de testes para garantir integridade após refatoração.

## 🚀 Pré-requisitos

1.  **Python 3.8+**
2.  **MPV Player:** Recomendado o [mpv.net](https://github.com/mpvnet-player/mpv.net) para Windows.
3.  **yt-dlp:** Essencial para o streaming de áudio.

## 🛠️ Instalação

1.  Instale as dependências:
    ```bash
    pip install syncedlyrics python-dotenv pytest
    ```
2.  Certifique-se de que o `yt-dlp` está no PATH do seu sistema.

## ⚙️ Configuração

Configure o arquivo `.env` na raiz:
```env
MPV_PATH="C:\Caminho\Para\Seu\mpvnet.exe"
```

## 📖 Como Usar

1. Execute a aplicação:
   ```bash
   python main.py
   ```
2. **Busca:** Digite Artista e Música (especifique se for 'Extended' ou 'Live').
3. **Validação:** Verifique o preview da letra no console e confirme com `S` ou `N`.
4. **Sincronia:** Se a letra estiver atrasada ou adiantada, use as teclas `[` e `]` para ajustar. O sistema salvará este ajuste automaticamente para a próxima vez.

## 🧪 Testes

Para validar a integridade do sistema:
```bash
python -m pytest
```

---
*Desenvolvido para entusiastas que buscam a precisão de um player profissional com a simplicidade do terminal.*
