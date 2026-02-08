import tkinter as tk 
from tkinter import ttk
from core.battery import status_bateria
from core.models import RegistroBateria
from db.repository import registro

class AppBateria:

    def __init__( self , root ):
        self.root = root
        root.title("Monitoramento de Bateria")

        self.label = ttk.Label( root, text="", font=( "Arial", 12 ) )
        self.label.pack( padx = 20 , pady = 10 ) 

        ttk.Button(root, text="Atualizar", command=self.atualizar).pack()

        self.atualizar()

    def atualizar( self ):
        dados = status_bateria()
        if not dados :
            self.label.config( text="Bateria não disponível")
            return 
        
        relatorio = RegistroBateria(**dados)

        if relatorio.plugged :
            status = "Fonte de Energia Conectada ( AC )"
        elif relatorio.running_time == -1:
            status = "Calculando tempo restante..."
        elif relatorio.running_time == -2:
            status = "Duração ilimitada detectada"
        else :
            horas = relatorio.running_time // 3600 
            minutos = ( relatorio.running_time % 3600 ) // 60
            status = f"Tempo restante : {horas}h {minutos}min  "

        
        
        try :
            registro(relatorio)
            feedback = "✅ SINCRONIZAÇÃO COM MYSQL"
        except Exception :
            feedback = "❌ ERRO DE SINCRONIZAÇÃO"
        
        self.label.config(
            text = 
                f"Percent: {relatorio.percent}%\n"
                f"Plugged: { 'Carregador plugado🔋' if relatorio.plugged else 'Uso em Bateria⚡'}\n"
                f"{status}\n"
                f"{feedback}"
        )     