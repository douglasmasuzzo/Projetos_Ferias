package br.com.interfacecurso.app;
import br.com.interfacecurso.view.TelaCursos;

public class Main {
    public static void main( String[] args ){
        javax.swing.SwingUtilities.invokeLater(TelaCursos :: new );
    }
}

/*
    -> PASSO A PASSO
     - inicie o programa " WAMP "
     - espere a configuração e visualize o status do servidor    
     - abra a pasta do projeto java no vscode
     - abra a pasta do projeto node.js no vscode
     - execute o arquivo.js e acesse o servidor 
     - após a ativação da API, acesse o browser e escreva "http://localhost:3000/cursos" ( arquivo.json )
     - retorne ao projeto java e compile o código principal ( CTRL + f5 )
     - espere inicializar a interface e clique em " carregar informações "
*/