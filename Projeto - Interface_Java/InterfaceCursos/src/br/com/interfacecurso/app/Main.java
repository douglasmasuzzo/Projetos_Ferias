package br.com.interfacecurso.app;
import br.com.interfacecurso.view.CursoView;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
       SwingUtilities.invokeLater( CursoView :: new );
    }    
}