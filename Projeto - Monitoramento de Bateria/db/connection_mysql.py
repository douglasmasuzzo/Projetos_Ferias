import os 
import pymysql
from dotenv import load_dotenv

load_dotenv("config/.env")

def get_connection() -> pymysql.connections.Connection:
    host=os.getenv("DB_HOST", "")
    user=os.getenv("DB_USER", "")
    password=os.getenv("DB_PASSWORD", "")
    database=os.getenv("DB_NAME", "")
    
    if not all ( [host, user, database] ):
        raise ValueError(
            "Variáveis de ambiente DB_HOST, DB_USER e DB_NAME"
            "não foram encontradas. Verifique o arquivo config/.env"
        )
    
    return pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        cursorclass=pymysql.cursors.DictCursor
    )