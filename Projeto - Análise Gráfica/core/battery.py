import psutil
from datetime import datetime

def status_bateria():
    
    bateria = psutil.sensors_battery()
    if not bateria: 
        return None
    
    tempo = bateria.secsleft

    if tempo < -2 :
        tempo = -1

    return {
        "timestamp": datetime.now(),
        "percent": bateria.percent,
        "plugged": bateria.power_plugged,
        "running_time": bateria.secsleft
    }