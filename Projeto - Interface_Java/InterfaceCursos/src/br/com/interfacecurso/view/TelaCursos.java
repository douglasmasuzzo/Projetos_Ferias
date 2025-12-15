package br.com.interfacecurso.view;
import br.com.interfacecurso.model.Curso;
import br.com.interfacecurso.service.CursoService;

import javax.swing.*; import javax.swing.table.DefaultTableModel; 
import java.awt.*; import java.util.List;

public class TelaCursos extends JFrame {

    private JTable tabela; private DefaultTableModel modelo;
    private JButton btnCarregar; private JButton btnLimpar;

    public TelaCursos(){
        configurarJanela();
        criarComponentes();
        setVisible( true );
    }

    private void configurarJanela(){
        setTitle( "MATRÍCULA DE CURSOS"); setSize( 600, 500 );
        setLocationRelativeTo( null );
        setDefaultCloseOperation( JFrame.EXIT_ON_CLOSE );
    }

    private void criarComponentes(){

        modelo = new DefaultTableModel(
            new Object[]{ "Código", "Curso", "Período", "Ano" }, 0 
        );

        tabela = new JTable( modelo ); JScrollPane scroll = new JScrollPane( tabela );

        btnCarregar = new JButton( "CARREGAR INFORMAÇÕES");
        btnLimpar = new JButton( "LIMPAR INFORMAÇÕES");

        btnCarregar.addActionListener( e -> carregarCursos() );
        btnLimpar.addActionListener( e -> modelo.setRowCount( 0 ) );

        JPanel painelBotoes = new JPanel(); 
        painelBotoes.add( btnCarregar ); painelBotoes.add( btnLimpar );
        add( scroll , BorderLayout.CENTER ); add( painelBotoes , BorderLayout.SOUTH );
    }

    private void carregarCursos(){ 

        try {
            List < Curso > cursos = CursoService.listarCursos();
            modelo.setRowCount( 0 );

            for ( Curso c : cursos ){
                modelo.addRow( 
                    new Object[]{ c.getCodigo(), c.getCurso(), c.getPeriodo(), c.getAno() } );
            }

            if ( cursos.isEmpty() ){
                JOptionPane.showMessageDialog( this, "NENHUM CURSO INFORMADO ");
            }
        } catch ( Exception e ) {
            JOptionPane.showMessageDialog( this, "FALAHA AO CONECTAR À API : \n" + e.getMessage(), "ERRO", JOptionPane.ERROR_MESSAGE );
        }
    }
}