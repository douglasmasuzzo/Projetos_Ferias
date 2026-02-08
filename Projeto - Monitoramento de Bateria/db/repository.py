from db.connection import get_connection

def registro( registro ):
    conn = get_connection()

    try:

        with conn.cursor() as cursor:
            cursor.execute(
                """
                    INSERT INTO analise_bateria ( timestamp, percent, plugged, running_time ) VALUES (%s, %s, %s, %s)
                """, 
                (
                    registro.timestamp,
                    registro.percent,
                    registro.plugged,
                    registro.running_time

                )
            )
        conn.commit()

    finally:
        conn.close() 