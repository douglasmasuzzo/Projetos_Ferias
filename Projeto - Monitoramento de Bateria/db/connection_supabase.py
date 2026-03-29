import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv("config/.env")

def get_client() -> Client:
    url : str = os.getenv("SUPABASE_URL", "")
    key : str = os.getenv("SUPABASE_KEY", "")

    if not url or not key:
        raise ValueError(
            "Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY"
            "não foram encontradas. Verifique o arquivo"
        )
    return create_client( url, key )  