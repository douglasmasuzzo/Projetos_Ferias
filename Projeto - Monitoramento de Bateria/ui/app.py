import tkinter as tk 
from tkinter import ttk

from core.battery import status_bateria
from core.models import RegistroBateria
from db.repository import salvar_registro

class AppBateria:

    def __init__( self , root: tk.Tk ) -> None:
        self.root = root
        root.title("Monitoramento de Bateria")
        root.resizable(False, False)

        frame = ttk.Frame( root, padding = 20 )
        frame.pack( fill = tk.BOTH, expand = True )

        ttk.Label(
            frame, 
            text = "🔋 Monitor de Bateria ",
            font = ("Arial", 16, "bold"),
        ).pack( pady = (0, 10) )

        self.label = ttk.Label(
            frame,
            text = "Carregando...",
            font = ( "Arial", 12 ),
            justify = tk.LEFT,
            anchor = tk.W,
        )
        self.label.pack( fill = tk.X , pady = (0, 10) )

        self.status_sync = ttk.Label(
            frame,
            text = "",
            font = ("Arial", 12 ),
            foreground = "gray",
        )
        self.status_sync.pack( fill = tk.X )

        ttk.Button(
            frame,
            text = "Atualizar",
            command = self.atualizar, 
        ).pack( pady = ( 12, 0 ) )

        self.atualizar()

    def atualizar( self ) -> None:
        dados = status_bateria()

        if not dados :
            self.label.config( text = "⚠️ Bateria não disponível")
            return 
        
        relatorio = RegistroBateria(**dados)

        if relatorio.plugged :
            status = "Fonte de Energia Conectada ( AC )🔌"
        elif relatorio.running_time == -1:
            status = "Calculando tempo restante..."
        else :
            horas = relatorio.running_time // 3600 
            minutos = ( relatorio.running_time % 3600 ) // 60
            status = f"Tempo restante : {horas}h {minutos}min  "

        self.label.config( 
            text = (
                f"Carga: { relatorio.percent:.1f}%\n "
                f"Status: {'Carregando 🔋' if relatorio.plugged else 'Em uso 🪫'}\n"
                f"{ status }"
            )
        )

        resultado = salvar_registro( relatorio )

        supabase_info = "✅ SINCRONIZAÇÃO COM SUBASE" if resultado["supabase"] else "❌ ERRO DE SINCRONIZAÇÃO"
        mysql_info = "✅ SINCRONIZAÇÃO COM MYSQL" if resultado["mysql"] else "❌ ERRO DE SINCRONIZAÇÃO"
        cor = "green" if resultado["supabase"] and resultado["mysql"] else "dark blue"

        self.status_sync.config(
            text = f"{ supabase_info } \n { mysql_info }",
            foreground = cor,
        )     