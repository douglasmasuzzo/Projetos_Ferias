import os
import time
import syncedlyrics
import subprocess
import re
import threading
import json
import shutil
from dotenv import load_dotenv

try:
    import msvcrt
except ImportError:
    msvcrt = None

load_dotenv()

MPV_PATH = os.getenv("MPV_PATH", r"C:\Users\masuz\AppData\Local\Programs\mpv.net\mpvnet.exe").strip('"').strip("'")

# Variáveis globais
tempo_atual = 0.0
duracao_total = 0.0
player_ativo = True
offset_ajuste = 0.0 

def formatar_tempo_lrc(lrc_timestamp):
    match = re.search(r'\[(\d+):(\d+(?:[\.\:]\d+)?)\]', lrc_timestamp)
    if match:
        minutos = int(match.group(1))
        segundos_str = match.group(2).replace(':', '.')
        return minutos * 60 + float(segundos_str)
    return None

def formatar_segundos(segundos):
    minutos = int(segundos // 60)
    segs = int(segundos % 60)
    return f"{minutos:02d}:{segs:02d}"

def limpar_console():
    os.system('cls' if os.name == 'nt' else 'clear')

def limpar_lrc(conteudo):
    if not conteudo: return ""
    texto = re.sub(r'\[.*?\]', '', conteudo)
    linhas = [linha.strip() for linha in texto.split('\n') if linha.strip()]
    return "\n".join(linhas)

def monitorar_via_ipc():
    global tempo_atual, duracao_total, player_ativo
    pipe_path = r'\\.\pipe\mpv-karaoke'
    
    for _ in range(30): 
        if os.path.exists(pipe_path): break
        time.sleep(0.5)
    
    while player_ativo:
        try:
            with open(pipe_path, 'w+b') as pipe:
                for prop in ["time-pos", "duration"]:
                    msg = f'{{"command": ["get_property", "{prop}"]}}\n'
                    pipe.write(msg.encode('utf-8'))
                    pipe.flush()
                    res = pipe.readline().decode('utf-8')
                    if res:
                        dados = json.loads(res)
                        if dados.get('data') is not None:
                            if prop == "time-pos": tempo_atual = float(dados['data'])
                            else: duracao_total = float(dados['data'])
        except: pass
        time.sleep(0.1)

def exibir_barra_status(atual, total, offset, modo_estatico=False):
    colunas = shutil.get_terminal_size().columns
    if total > 0:
        percent = min(atual / total, 1.0)
        largura_barra = colunas - 45
        preenchido = int(largura_barra * percent)
        barra = "█" * preenchido + "░" * (largura_barra - preenchido)
        tempo_str = f"{formatar_segundos(atual)} / {formatar_segundos(total)}"
        ajuste_str = f" [Sinc: {offset:+.1f}s]" if not modo_estatico else ""
        print(f"\r\033[K   {tempo_str}  \033[1;34m{barra}\033[0m{ajuste_str}", end="", flush=True)

def exibir_cabecalho(musica, artista, modo_estatico=False):
    limpar_console()
    colunas = shutil.get_terminal_size().columns
    cor = "\033[1;33m" if modo_estatico else "\033[1;36m"
    status = " (MODO ESTÁTICO)" if modo_estatico else ""
    print(f"{cor}╔" + "═"*(colunas-2) + f"╗\033[0m")
    titulo = f" 🎤 KARAOKÊ PREMIUM{status}: {musica.upper()} - {artista.upper()} "
    print(f"{cor}║" + titulo.center(colunas-2) + f"║\033[0m")
    print(f"{cor}╠" + "═"*(colunas-2) + f"╣\033[0m")

def buscar_letra_inteligente(artista, musica):
    termos = [
        f"{artista} {musica}",
        f"{musica} {artista}",
        f"{artista} {musica} official"
    ]
    
    for termo in termos:
        print(f"\033[90m🔎 Buscando por: '{termo}'...\033[0m")
        try:
            # Tenta múltiplos provedores para garantir qualidade
            lrc = syncedlyrics.search(termo)
            if lrc and "[" in lrc and len(lrc) > 100:
                # Preview da letra para o usuário
                linhas_limpas = limpar_lrc(lrc).split('\n')[:3]
                print(f"\n\033[1;32m✅ Letra encontrada!\033[0m")
                print(f"\033[90mPreview:\033[0m\n   > " + "\n   > ".join(linhas_limpas))
                confirmar = input("\n❔ Esta letra está correta? (S/n): ").lower()
                if confirmar != 'n':
                    return lrc
        except: continue
    return None

def tocar_karaoke():
    global player_ativo, tempo_atual, duracao_total, offset_ajuste
    limpar_console()
    print("\033[1;35m" + " INITIALIZING KARAOKE ENGINE... ".center(50, "=") + "\033[0m")
    
    artista = input("\n👤 Nome do Artista: ")
    musica = input("🎵 Nome da Música: ")
    
    # Busca por áudio oficial para evitar versões com introduções longas
    busca_audio = f"{artista} {musica} official audio"

    lrc_content = buscar_letra_inteligente(artista, musica)

    letras = []
    if lrc_content:
        for linha in lrc_content.split('\n'):
            t = formatar_tempo_lrc(linha)
            if t is not None:
                txt = linha.split("]")[-1].strip()
                if txt: letras.append({"tempo": t, "texto": txt})

    modo_estatico = len(letras) == 0
    texto_estatico = limpar_lrc(lrc_content) if lrc_content else "Letra não encontrada."

    # Comando MPV
    comando = [MPV_PATH, f"ytdl://ytsearch:{busca_audio}", "--input-ipc-server=\\\\.\\pipe\\mpv-karaoke", 
               "--force-window=yes", "--video=no", "--geometry=500x300", "--title=CONTROLE", "--ontop=yes"]

    try:
        player = subprocess.Popen(comando, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except:
        print("❌ Erro ao abrir MPV. Verifique o caminho no .env")
        return

    threading.Thread(target=monitorar_via_ipc, daemon=True).start()

    if modo_estatico:
        exibir_cabecalho(musica, artista, True)
        print("\n" + texto_estatico + "\n")
        print("\033[1;33m" + "═"*shutil.get_terminal_size().columns + "\033[0m")
    else:
        exibir_cabecalho(musica, artista, False)

    try:
        while player.poll() is None:
            # Teclas de ajuste: [ (atrasa) ] (adianta)
            if msvcrt and msvcrt.kbhit():
                tecla = msvcrt.getch()
                if tecla == b'[': offset_ajuste -= 0.3
                elif tecla == b']': offset_ajuste += 0.3

            if modo_estatico:
                exibir_barra_status(tempo_atual, duracao_total, 0, True)
            else:
                indice_da_vez = -1
                for i, item in enumerate(letras):
                    if tempo_atual >= (item["tempo"] + offset_ajuste):
                        indice_da_vez = i
                    else: break
                
                letra_txt = letras[indice_da_vez]["texto"] if indice_da_vez != -1 else "..."
                proxima_txt = letras[indice_da_vez+1]["texto"] if (indice_da_vez + 1) < len(letras) else "---"
                
                exibir_cabecalho(musica, artista, False)
                print("\n" * 2)
                print("\033[1;32m" + letra_txt.center(shutil.get_terminal_size().columns) + "\033[0m")
                print("\n\033[90m" + f"({proxima_txt})".center(shutil.get_terminal_size().columns) + "\033[0m")
                print("\n" * 2)
                exibir_barra_status(tempo_atual, duracao_total, offset_ajuste)
            
            time.sleep(0.2)

    except KeyboardInterrupt: pass
    finally:
        player_ativo = False
        player.terminate()
        print("\n\n\033[1;35m--- SESSÃO ENCERRADA ---\033[0m")

if __name__ == "__main__":
    tocar_karaoke()
