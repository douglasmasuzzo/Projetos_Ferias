import psutil
from datetime import datetime

def status_bateria():
    
    bateria = psutil.sensors_battery()
    if not bateria: 
        return None
    
    return {
        "timestamp": datetime.now().srtftime(),
        "percentual": bateria.percent,
        "carregando": bateria.power_plugged,
        "tempo_restante": bateria.secsleft
    }