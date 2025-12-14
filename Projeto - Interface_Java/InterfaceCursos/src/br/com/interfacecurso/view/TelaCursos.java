package br.com.interfacecurso.view;

import javax.swing.*; import java.awt.*;

public class TelaCursos extends JFrame {
    
    private JTable tabelaCursos;
    private JButton btnCarregar;
    private JButton btnLimpar;

    public TelaCursos(){
        setTitle("Análise de Cursos");
        setSize( 600 , 500 );
        setDefaultCloseOperation( JFrame.EXIT_ON_CLOSE );
        setLocationRelativeTo( null );
        setLayout( new BorderLayout() );
        criarComponentes();
        setVisible( true );
    }

    private void criarComponentes(){
        String[] colunas = { "Código", "Curso", "Período", "Ano" }; 
        Object[][] dados = {};

        tabelaCursos = new JTable( dados, colunas );
        JScrollPane scrollPane = new JScrollPane( tabelaCursos );
        
        btnCarregar = new JButton( "Carregar Cursos");
        btnLimpar = new JButton("Limpar Cursos");
        
        JPanel painelBotoes = new JPanel();
        painelBotoes.add( btnCarregar ); painelBotoes.add( btnLimpar );

        add( scrollPane, BorderLayout.CENTER ); add( painelBotoes, BorderLayout.SOUTH );
    }
}
