import os
import time
import json
import logging
from typing import Optional

from config.settings import (
    SYNC_OFFSET_STEP,
    DISPLAY_REFRESH,
    LRC_SEARCH_TERMS_TEMPLATE,
)
from core.models import KaraokeSession, SyncState, LyricLine
from core.sync_engine import calcular_indice_atual, aplicar_offset
from services.lyrics_service import LyricsService
from services.player_service import PlayerService
from ui.renderer import Renderer
from ui.input_handler import InputHandler, KeyAction

# Configuração de Logs
logging.basicConfig(level=logging.WARNING, format='%(levelname)s: %(message)s')

OFFSET_FILE = "offsets.json"


def carregar_offsets() -> dict:
    if os.path.exists(OFFSET_FILE):
        try:
            with open(OFFSET_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def salvar_offset(musica_id: str, offset: float):
    offsets = carregar_offsets()
    offsets[musica_id] = round(offset, 2)
    try:
        with open(OFFSET_FILE, "w") as f:
            json.dump(offsets, f)
    except Exception:
        pass


def buscar_letra_interativa(artist: str, title: str, service: LyricsService, renderer: Renderer) -> Optional[str]:
    for template in LRC_SEARCH_TERMS_TEMPLATE:
        term = template.format(artist=artist, title=title)
        renderer.draw_search_status(term)

        try:
            lrc = service.search(artist, title) # Simplificado para usar a lógica interna do service
            if lrc:
                # Preview para o usuário
                preview = service.get_preview(lrc, max_lines=4)
                renderer.draw_lyrics_preview(preview)
                
                escolha = input("\n❓ Esta letra está completa e correta? (S/N/PULAR): ").lower()
                if escolha in ('s', ''):
                    return lrc
                elif escolha == 'pular':
                    break
        except Exception:
            continue
    return None


def main():
    renderer = Renderer()
    renderer.draw_startup()

    artist = input("👤 Artista: ").strip()
    title = input("🎵 Música: ").strip()
    
    if not artist or not title:
        renderer.draw_error("Artista e Música são obrigatórios.")
        return

    musica_id = f"{artist}-{title}".lower().replace(" ", "_")
    
    # Carregar offsets persistidos
    offsets_salvos = carregar_offsets()
    offset_inicial = offsets_salvos.get(musica_id, 0.0)
    
    # Serviços
    lyrics_svc = LyricsService()
    player_svc = PlayerService()
    
    # Busca de Letra
    lrc_content = buscar_letra_interativa(artist, title, lyrics_svc, renderer)
    
    # Prepara a sessão
    session = KaraokeSession(
        artist=artist,
        title=title,
        sync_state=SyncState(offset=offset_inicial)
    )

    if lrc_content:
        session.lyrics = lyrics_svc.parse_lrc(lrc_content)
        session.static_text = lyrics_svc.extract_plain_text(lrc_content)
    
    # Inicia o Player
    if not player_svc.start(session.search_query_audio):
        renderer.draw_error("Não foi possível iniciar o player (MPV).")
        return

    renderer.draw_header(session)
    print(f"\n▶ Player iniciado. Sincronia: {session.sync_state.offset:+.1f}s")

    try:
        with InputHandler() as input_handler:
            while player_svc.is_running():
                # Atualiza estado do player
                session.player_state = player_svc.state
                
                # Processa Input
                action = input_handler.poll()
                if action == KeyAction.OFFSET_DECREASE:
                    session.sync_state = aplicar_offset(session.sync_state, -SYNC_OFFSET_STEP)
                    salvar_offset(musica_id, session.sync_state.offset)
                elif action == KeyAction.OFFSET_INCREASE:
                    session.sync_state = aplicar_offset(session.sync_state, SYNC_OFFSET_STEP)
                    salvar_offset(musica_id, session.sync_state.offset)
                elif action == KeyAction.QUIT:
                    break

                # Renderiza
                renderer.clear()
                renderer.draw_header(session)
                
                if session.is_static_mode:
                    renderer.draw_static_lyrics(session.static_text)
                else:
                    idx = calcular_indice_atual(session.lyrics, session.player_state, session.sync_state)
                    session.sync_state.current_index = idx
                    
                    cur_text = session.lyrics[idx].text if idx != -1 else "..."
                    nxt_text = session.lyrics[idx + 1].text if (idx + 1) < len(session.lyrics) else "---"
                    renderer.draw_lyrics(cur_text, nxt_text)

                renderer.draw_status_bar(session.player_state, session.sync_state)
                time.sleep(DISPLAY_REFRESH)

    except KeyboardInterrupt:
        pass
    finally:
        player_svc.stop()
        renderer.draw_session_end()


if __name__ == "__main__":
    main()
