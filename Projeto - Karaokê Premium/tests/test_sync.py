from core.sync_engine import calcular_indice_atual
from core.models import LyricLine, PlayerState, SyncState

def test_deve_encontrar_indice_correto():
    letras = [
        LyricLine(timestamp=10.0, text="Linha 1"),
        LyricLine(timestamp=20.0, text="Linha 2")
    ]

    state = PlayerState(position=15.0) # Player está nos 15 segundos
    sync = SyncState(offset=0.0)
     
    idx = calcular_indice_atual(letras, state, sync)
    assert idx == 0 # Deve mostrar a "Linha 1"