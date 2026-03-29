from db.connection_supabase import get_client
from db.connection_mysql import get_connection
from core.models import RegistroBateria

TABLE_NAME = "analise_bateria"

def salvar_registro( registro: RegistroBateria ) -> dict:
    resultado = {"supabase": False, "mysql": False, "erros": []}
    
    try:
        client = get_client()
        response = ( 
            client.table(TABLE_NAME)
            .insert({
                "timestamp": registro.timestamp.isoformat(),
                "percent": registro.percent,
                "plugged": registro.plugged,
                "running_time": registro.running_time,
            })
            .execute()
        )

        if not response.data:
            raise RuntimeError("Supabase não retornou dados após INSERT.")
        resultado["supabase"] = True
        
    except Exception as exc:
        resultado["erros"].append(f"Supabase: { exc }")

    try :
        conn = get_connection()
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
                ),
            )
        conn.commit()
        resultado["mysql"] = True

    except Exception as exc:
        resultado["erros"].append(f"MySQL: {exc}")

    finally:
        try:
            conn.close()
        except Exception:
            pass
    return resultado  