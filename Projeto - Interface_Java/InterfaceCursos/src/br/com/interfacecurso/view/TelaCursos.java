package br.com.interfacecurso.view;
import br.com.interfacecurso.service.CursoService;

import java.awt.*; import javax.swing.*;
import javax.swing.table.DefaultTableModel;

public class TelaCursos extends JFrame {
    
    private JTable tabelaCursos;
    private JButton btnCarregar;
    private JButton btnLimpar;
    private DefaultTableModel tableModel;

    public TelaCursos(){
        setTitle("Matrícula de Cursos");
        setSize( 600 , 500 );
        setDefaultCloseOperation( JFrame.EXIT_ON_CLOSE );
        setLocationRelativeTo( null );
        criarComponentes(); setVisible( true );
    }

    private void criarComponentes(){
        String[] colunas = { "Código", "Curso", "Período", "Ano" }; 
        tableModel = new DefaultTableModel( colunas, 0);
        tabelaCursos = new JTable( tableModel );

        JScrollPane scrollPane = new JScrollPane( tabelaCursos );
        
        btnCarregar = new JButton( "Carregar Cursos");
        btnLimpar = new JButton("Limpar Cursos");
        btnCarregar.addActionListener(e -> carregarCursosDaAPI() );
        btnLimpar.addActionListener(e -> tableModel.setRowCount( 0 ) );
        
        JPanel painelBotoes = new JPanel();
        painelBotoes.add( btnCarregar ); painelBotoes.add( btnLimpar );

        add( scrollPane, BorderLayout.CENTER );
        add( painelBotoes, BorderLayout.SOUTH );
    }

    private void carregarCursosDaAPI(){

        try {
            String json = CursoService.buscarCursos();
            System.out.println("RESPOSTA DA API : " + json );
            tableModel.setRowCount( 0 );

            json = json
                .replace("[","")
                .replace("]","")
                .replace("{","")
                .replace("}","")
            ;

            String[] registros = json.split( "(?<=),");

            for ( String registro : registros ){
                String[] campos = registro.split(",");
                
                int codigo = Integer.parseInt( campos[ 0 ].split( ":")[ 1 ].trim() );
                String curso = campos[1].split(":")[1].replace("\"", "").trim();
                String periodo = campos[2].split(":")[1].replace("\"", "").trim();
                int ano = Integer.parseInt( campos[3].split(":")[1].trim() );
                
                tableModel.addRow( new Object[]{ codigo, curso, periodo, ano });
            } 
                
        } catch ( Exception e ){
            JOptionPane.showMessageDialog( 
                this, "ERRO AO CONSUMIR A API",
                "ERRO", JOptionPane.ERROR_MESSAGE 
            );
        }
    }
}
