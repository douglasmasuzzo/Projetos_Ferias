import tkinter as tk 
from tkinter import ttk
from core.battery import status_bateria
from core.storage import registro

class AppBateria:

    def __init__( self , root ):
        self.root = root
        root.title = ("Monitoramento de Bateria")

        self.label = ttk.Label( root, text="", font=( "Arial", 12 ) )
        self.label.pack( padx = 20 , pady = 10 ) 

        self.botao = ttkButton( root , text="Atualizar", command=self.atualizar )
        self.botao.pack( pady = 5 )

    def atualizar( self ):
        dados = status_bateria()
        if not dados :
            self.label.config( text="Bateria não disponível")
            return 
        
        texto = ( 
            f"Percentual: { dados [ 'percentual' ] }%\n"
            f"Carregando: { True if dados[ 'carregando' ] else False }"
        )

        self.label.config( text = texto )
        registro( dados )