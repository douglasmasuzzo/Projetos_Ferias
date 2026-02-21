import psutil
from datetime import datetime

def status_bateria( percent_ant=None, timestamp_ant=None ):
    
    bateria = psutil.sensors_battery()
    if not bateria:
        return None
    
    percent_atual = bateria.percent
    timestamp_atual = datetime.now()

    tempo_estimado = bateria.secsleft

    if tempo_estimado in (
        psutil.POWER_TIME_UNLIMITED, psutil.POWER_TIME_UNKNOWN
    ):
        
        tempo_estimado = - 1

    if percent_ant is not None and timestamp_ant is not None :

        percent = percent_ant - percent_atual
        tempo = ( timestamp_atual - timestamp_ant ).total_seconds()

        if percent > 0 and tempo > 0 :
            descarga = percent / tempo 
            tempo_estimado = int ( percent_atual / descarga )

    return{
        "timestamp": timestamp_atual,
        "percent": percent_atual,
        "plugged": bateria.power_plugged,
        "running_time": tempo_estimado
    }