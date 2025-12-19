package br.com.interfacecurso.view;
import br.com.interfacecurso.model.Curso;
import br.com.interfacecurso.service.CursoService;

import java.awt.*; import javax.swing.*;
import java.util.List; import javax.swing.table.DefaultTableModel;

public class CursoView extends JFrame {

    private JTable tabela; private DefaultTableModel modelo;
    private JButton btnCarregar; private JButton btnLimpar;

    public CursoView() {
        configurarJanela(); criarComponentes(); setVisible(true);
    }

    private void configurarJanela() {
        setTitle("MATRÍCULA DE CURSOS");
        setSize(600, 500);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
    }

    private void criarComponentes() {

        modelo = new DefaultTableModel(
                new Object[]{"Código", "Curso", "Período", "Ano"}, 0
        );

        tabela = new JTable(modelo); 
        JScrollPane scroll = new JScrollPane(tabela);
        btnCarregar = new JButton("CARREGAR CURSOS"); 
        btnLimpar = new JButton("LIMPAR TABELA");

        btnCarregar.addActionListener(e -> carregarCursos());
        btnLimpar.addActionListener(e -> modelo.setRowCount(0));

        JPanel painelBotoes = new JPanel();
        painelBotoes.add(btnCarregar); painelBotoes.add(btnLimpar);
        add(scroll, BorderLayout.CENTER);add(painelBotoes, BorderLayout.SOUTH);
    }

    private void carregarCursos() {

        try {
            CursoService service = new CursoService();
            List< Curso > cursos = service.listarCursos();

            modelo.setRowCount(0);

            if (cursos.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Nenhum curso encontrado.");return;
            }

            for (Curso c : cursos) {
                modelo.addRow(new Object[]{
                        c.getCodigo(),
                        c.getCurso(),
                        c.getPeriodo(),
                        c.getAno()
                });
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(
                    this,
                    "Erro ao conectar com a API:\n" + e.getMessage(),
                    "ERRO",
                    JOptionPane.ERROR_MESSAGE
            );
        }
    }
}
