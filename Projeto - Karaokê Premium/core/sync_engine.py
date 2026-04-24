from core.models import LyricLine, SyncState, PlayerState
from config.settings import IPC_LATENCY_COMPENSATION


def calcular_indice_atual(
    lyrics: list[LyricLine],
    state: PlayerState,
    sync: SyncState,
) -> int:
    if not lyrics:
        return -1

    tempo_efetivo = state.position + IPC_LATENCY_COMPENSATION + sync.offset

    esquerda, direita = 0, len(lyrics) - 1
    resultado = -1

    while esquerda <= direita:
        meio = (esquerda + direita) // 2
        if lyrics[meio].timestamp <= tempo_efetivo:
            resultado = meio
            esquerda = meio + 1
        else:
            direita = meio - 1

    return resultado


def calcular_progresso(state: PlayerState) -> float:
    if state.duration <= 0:
        return 0.0
    return min(state.position / state.duration, 1.0)


def aplicar_offset(sync: SyncState, delta: float) -> SyncState:
    return SyncState(
        offset=sync.offset + delta,
        current_index=sync.current_index,
        is_static_mode=sync.is_static_mode,
    )
