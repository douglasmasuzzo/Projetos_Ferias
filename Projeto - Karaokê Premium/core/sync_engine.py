def calcular_indice_atual(letras, player_state, sync_state):
    indice_da_vez = -1
    for i, item in enumerate(letras):
        if player_state.position >= (item.timestamp + sync_state.offset) :
            indice_da_vez = i
        else:
            break
    return indice_da_vez