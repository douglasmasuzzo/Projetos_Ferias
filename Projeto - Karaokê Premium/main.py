import os
import time
import subprocess
import threading
import json
import shutil
import syncedlyrics
from dotenv import load_dotenv

# Imports das novas camadas
from core.models import LyricLine, PlayerState, SyncState
from core.sync_engine import calcular_indice_atual
from services.lyrics_service import LyricsService

try:
    import msvcrt
except ImportError:
    msvcrt = None

load_dotenv()

# Configurações
MPV_PATH = os.getenv("MPV_PATH", "mpv").strip('"').strip("'")
PIPE_PATH = r'\\.\pipe\mpv-karaoke'
OFFSET_FILE = "offsets.json"

# Estado Global
estado_player = PlayerState(position=0.0)
estado_sync = SyncState(offset=0.0)
duracao_total = 0.0
player_ativo = True

def carregar_offsets():
    if os.path.exists(OFFSET_FILE):
        try:
            with open(OFFSET_FILE, "r") as f:
                return json.load(f)
        except: return {}
    return {}

def salvar_offset(musica_id, offset):
    offsets = carregar_offsets()
    offsets[musica_id] = round(offset, 2)
    try:
        with open(OFFSET_FILE, "w") as f:
            json.dump(offsets, f)
    except: pass

def formatar_segundos(segundos):
    minutos = int(segundos // 60)
    segs = int(segundos % 60)
    return f"{minutos:02d}:{segs:02d}"

def limpar_console():
    os.system('cls' if os.name == 'nt' else 'clear')

def limpar_lrc(conteudo):
    if not conteudo: return ""
    import re
    texto = re.sub(r'\[.*?\]', '', conteudo)
    linhas = [linha.strip() for linha in texto.split('\n') if linha.strip()]
    return "\n".join(linhas)

def monitorar_via_ipc():
    global duracao_total, player_ativo
    for _ in range(30): 
        if os.path.exists(PIPE_PATH): break
        time.sleep(0.5)
    
    while player_ativo:
        try:
            with open(PIPE_PATH, 'w+b') as pipe:
                for prop in ["time-pos", "duration"]:
                    msg = f'{{"command": ["get_property", "{prop}"]}}\n'
                    pipe.write(msg.encode('utf-8'))
                    pipe.flush()
                    res = pipe.readline().decode('utf-8')
                    if res:
                        dados = json.loads(res)
                        if dados.get('data') is not None:
                            if prop == "time-pos": 
                                estado_player.position = float(dados['data'])
                            else: 
                                duracao_total = float(dados['data'])
        except: pass
        time.sleep(0.1)

def exibir_interface(musica, artista, letras, modo_estatico=False):
    colunas = shutil.get_terminal_size().columns
    cor = "\033[1;33m" if modo_estatico else "\033[1;36m"
    status_msg = " (MODO ESTÁTICO)" if modo_estatico else ""
    limpar_console()
    print(f"{cor}╔" + "═"*(colunas-2) + "╗\033[0m")
    print(f"{cor}║" + f" 🎤 KARAOKÊ PREMIUM: {musica.upper()} - {artista.upper()}{status_msg} ".center(colunas-2) + "║\033[0m")
    print(f"{cor}╠" + "═"*(colunas-2) + "╣\033[0m")

    if modo_estatico:
        print("\n" + letras + "\n")
    else:
        idx = calcular_indice_atual(letras, estado_player, estado_sync)
        letra_atual = letras[idx].text if idx != -1 else "..."
        proxima_letra = letras[idx+1].text if (idx + 1) < len(letras) else "---"
        print("\n" * 2)
        print("\033[1;32m" + letra_atual.center(colunas) + "\033[0m")
        print("\n\033[90m" + f"({proxima_letra})".center(colunas) + "\033[0m")
        print("\n" * 2)

    if duracao_total > 0:
        percent = min(estado_player.position / duracao_total, 1.0)
        barra = "█" * int((colunas-45) * percent) + "░" * ((colunas-45) - int((colunas-45) * percent))
        tempo_str = f"{formatar_segundos(estado_player.position)} / {formatar_segundos(duracao_total)}"
        ajuste_str = f" [Sinc: {estado_sync.offset:+.1f}s]" if not modo_estatico else ""
        print(f"\r\033[K   {tempo_str}  \033[1;34m{barra}\033[0m{ajuste_str}", end="", flush=True)

def buscar_letra_interativa(artista, musica):
    svc = LyricsService()
    # Ordem de busca: Termo exato -> Oficial -> Artista+Musica
    variacoes = [
        f"{artista} {musica}",
        f"{artista} {musica} ",
        f"{artista} {musica} full lyrics"
    ]
    
    for termo in variacoes:
        print(f"\033[90m🔎 Tentando busca: '{termo}'...\033[0m")
        try:
            lrc = syncedlyrics.search(termo)
            if lrc and "[" in lrc:
                # Preview para o usuário
                preview = limpar_lrc(lrc).split('\n')[:4]
                print(f"\n\033[1;32m✅ Letra encontrada!\033[0m")
                print(f"\033[90m--- PREVIEW ---\033[0m")
                for p in preview: print(f"  > {p}")
                print(f"\033[90m---------------\033[0m")
                
                escolha = input("❓ Esta letra está completa e correta? (S/N/PULAR): ").lower()
                if escolha == 's' or escolha == '':
                    return lrc, svc
                elif escolha == 'pular':
                    break
        except: continue
    return None, svc

def main():
    global player_ativo
    limpar_console()
    print("\033[1;35m" + " KARAOKÊ PREMIUM V2.1 ".center(50, "=") + "\033[0m")
    
    artista = input("\n👤 Artista: ").strip()
    musica = input("🎵 Música: ").strip()
    musica_id = f"{artista}-{musica}".lower().replace(" ", "_")
    
    # Persistência de Offset
    offsets_salvos = carregar_offsets()
    estado_sync.offset = offsets_salvos.get(musica_id, 0.0)
    
    lrc_content, service = buscar_letra_interativa(artista, musica)
    letras_objetos = []

    if lrc_content:
        for linha in lrc_content.split('\n'):
            tempo = service._parse_timestamp(linha)
            texto = linha.split("]")[-1].strip()
            if tempo is not None and texto:
                letras_objetos.append(LyricLine(timestamp=tempo, text=texto))

    modo_estatico = len(letras_objetos) == 0
    conteudo_exibicao = limpar_lrc(lrc_content) if modo_estatico else letras_objetos

    # Busca de áudio focada no termo exato do usuário
    busca_audio = f"{artista} {musica}"
    if "extended" not in busca_audio.lower() and "extended" in musica.lower():
        busca_audio += " extended"

    comando = [MPV_PATH, f"ytdl://ytsearch:{busca_audio} official audio", 
               f"--input-ipc-server={PIPE_PATH}", "--video=no", "--ontop=yes", "--title=KARAOKE_CONTROLE"]
    
    try:
        player = subprocess.Popen(comando, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        threading.Thread(target=monitorar_via_ipc, daemon=True).start()

        print(f"\n\033[1;32m▶ Player iniciado. Sincronia salva: {estado_sync.offset:+.1f}s\033[0m")
        print("\033[90m(Dica: Use '[' e ']' para ajustar em tempo real)\033[0m\n")

        while player.poll() is None:
            if msvcrt and msvcrt.kbhit():
                tecla = msvcrt.getch()
                if tecla == b'[': 
                    estado_sync.offset -= 0.5
                    salvar_offset(musica_id, estado_sync.offset)
                elif tecla == b']': 
                    estado_sync.offset += 0.5
                    salvar_offset(musica_id, estado_sync.offset)

            exibir_interface(musica, artista, conteudo_exibicao, modo_estatico)
            time.sleep(0.1)

    except KeyboardInterrupt: pass
    finally:
        player_ativo = False
        if 'player' in locals(): player.terminate()
        print(f"\n\n\033[1;35m--- SESSÃO ENCERRADA (Offset final: {estado_sync.offset:+.1f}s) ---\033[0m")

if __name__ == "__main__":
    main()
