import psutil
import mysql.connector
import time
from datetime import datetime

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="bateria",
        port=3306
    )

def coletar_dados( intervalo = 60 , ciclos = 5 ):
    conc = conectar()
    cursor = conc.cursor()

    for i in range( ciclos ):
        bateria = psutil.sensors_battery()

        if bateria is None:
            print("❌ BATERIA NÃO DETECTADA ❌")
            break

        cursor.execute( """
            INSERT INTO bateria ( timestamp, percent , plugged ) VALUES ( %s, %s, %s )
        """, (

        datetime.now(),
        bateria.percent,
        bateria.power_plugged

        ))

        conc.commit()
        print(f"✅ REGISTRO { i + 1 }/{ ciclos } SALVO")

        if i < ciclos - 1 :
            time.sleep( intervalo )

        
    cursor.close()
    conc.close()

if __name__ == "__main__":
    coletar_dados()