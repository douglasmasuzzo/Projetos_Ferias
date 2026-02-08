import csv
import os

arquivo = "data/historico_bateria.csv"

def registro( dados ):
    with open( arquivo, "a", newline="", encoding="utf-8") as f :
        writer = csv.DictWriter( 
            f , 
            fieldnames = [ "timestamp", "percentual", "carregando", "tempo_restante "]
        )

        if not existe :
            writer.writeheader()

        writer.writerow( dados )