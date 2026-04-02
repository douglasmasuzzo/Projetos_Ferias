import os
import time
import syncedlyrics
import subprocess
import re
import threading
import json
import shutil
from dotenv import load_dotenv

load_dotenv()

# Caminho para o executável
MPV_PATH = os.getenv("MPV_PATH", r"C:\Users\masuz\AppData\Local\Programs\mpv.net\mpvnet.exe").strip('"').strip("'")

# Variáveis globais
tempo_atual = 0.0
duracao_total = 0.0
player_ativo = True

def formatar_tempo_lrc(lrc_timestamp):
    match = re.search(r'\[(\d+):(\d+\.\d+)\]', lrc_timestamp)
    if match:
        return int(match.group(1)) * 60 + float(match.group(2))
    return None

def formatar_segundos(segundos):
    minutos = int(segundos // 60)
    segs = int(segundos % 60)
    return f"{minutos:02d}:{segs:02d}"

def limpar_console():
    os.system('cls' if os.name == 'nt' else 'clear')

def monitorar_via_ipc():
    """Comunicação direta com o motor do MPV via Named Pipe."""
    global tempo_atual, duracao_total, player_ativo
    pipe_path = r'\\.\pipe\mpv-karaoke'
    
    # Aguarda o Pipe ser criado pelo MPV
    for _ in range(30): 
        if os.path.exists(pipe_path): break
        time.sleep(0.5)
    
    while player_ativo:
        try:
            with open(pipe_path, 'w+b') as pipe:
                # Pergunta tempo atual e duração total
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

def exibir_layout(musica, artista, letra_atual, proxima_letra):
    limpar_console()
    colunas = shutil.get_terminal_size().columns
    
    # Cabeçalho
    print("\033[1;36m" + "╔" + "═"*(colunas-2) + "╗\033[0m")
    titulo = f" 🎤 KARAOKÊ PREMIUM: {musica.upper()} - {artista.upper()} "
    print("\033[1;36m║" + titulo.center(colunas-2) + "║\033[0m")
    print("\033[1;36m" + "╠" + "═"*(colunas-2) + "╣\033[0m")

    # Espaçamento Central
    print("\n" * 3)
    
    # Letra Principal (Verde Brilhante)
    print("\033[1;32m" + letra_atual.center(colunas) + "\033[0m")
    
    # Próxima Letra (Cinza)
    print("\n\033[90m" + f"({proxima_letra})".center(colunas) + "\033[0m")
    
    print("\n" * 3)

    # Barra de Progresso
    if duracao_total > 0:
        percent = tempo_atual / duracao_total
        largura_barra = colunas - 20
        preenchido = int(largura_barra * percent)
        barra = "█" * preenchido + "░" * (largura_barra - preenchido)
        tempo_str = f"{formatar_segundos(tempo_atual)} / {formatar_segundos(duracao_total)}"
        print(f"   {tempo_str}  \033[1;34m{barra}\033[0m".center(colunas))

    # Rodapé de Instruções
    print("\n\033[1;36m" + "╚" + "═"*(colunas-2) + "╝\033[0m")
    print("\033[90mControles no Player: [Espaço] Pause | [Setas] Pular trechos\033[0m".center(colunas))

def tocar_karaoke():
    limpar_console()
    print("\033[1;35m" + " INITIALIZING KARAOKE ENGINE... ".center(50, "=") + "\033[0m")
    
    artista = input("\n👤 Nome do Artista: ")
    musica = input("🎵 Nome da Música: ")
    
    # Dica: Adicionar 'Official Audio' ajuda a sincronizar com letras de CD
    busca_audio = f"{musica} {artista} official audio"
    busca_letra = f"{musica} {artista}"

    # OFFSET: Se a música estiver adiantada/atrasada, mude este valor (em segundos)
    # Ex: 2.0 (atrasa a letra em 2s) | -2.0 (adianta a letra em 2s)
    offset_ajuste = 0.0 

    print(f"\n\033[90m🔎 Buscando letra sincronizada em nuvem...\033[0m")
    try:
        lrc_content = syncedlyrics.search(busca_letra)
    except:
        print("❌ Erro ao conectar ao servidor de letras.")
        return

    if not lrc_content:
        print("❌ Letra não encontrada.")
        return

    # Parsing das letras
    letras = []
    for linha in lrc_content.split('\n'):
        t = formatar_tempo_lrc(linha)
        if t is not None:
            txt = linha.split("]")[-1].strip()
            if txt: letras.append({"tempo": t + offset_ajuste, "texto": txt})

    if not letras:
        print("❌ Letra encontrada, mas não é sincronizada.")
        return

    # Iniciar MPV com janela VISÍVEL e controles IPC
    comando = [
        MPV_PATH,
        f"ytdl://ytsearch:{busca_audio}",
        "--input-ipc-server=\\\\.\\pipe\\mpv-karaoke",
        "--force-window=yes",
        "--video=no",
        "--geometry=500x300",
        "--title=CONTROLE DO KARAOKE",
        "--ontop=yes"
    ]

    try:
        player = subprocess.Popen(comando, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        print(f"❌ Erro ao abrir MPV: {e}")
        return

    threading.Thread(target=monitorar_via_ipc, daemon=True).start()

    indice_exibido = -1
    global player_ativo
    
    try:
        while player.poll() is None:
            # Lógica de seleção de letra
            indice_da_vez = -1
            for i, item in enumerate(letras):
                if tempo_atual >= item["tempo"]:
                    indice_da_vez = i
                else: break
            
            # Atualização do Display
            letra_txt = letras[indice_da_vez]["texto"] if indice_da_vez != -1 else "..."
            proxima_txt = letras[indice_da_vez+1]["texto"] if (indice_da_vez + 1) < len(letras) else "---"
            
            # Só atualizamos se o tempo mudar ou a letra mudar
            exibir_layout(musica, artista, letra_txt, proxima_txt)
            
            time.sleep(0.15) # Refresh rate balanceado

    except KeyboardInterrupt:
        pass
    finally:
        player_ativo = False
        player.terminate()
        print("\n\033[1;35m--- SESSÃO DE KARAOKÊ ENCERRADA ---\033[0m")

if __name__ == "__main__":
    tocar_karaoke()
