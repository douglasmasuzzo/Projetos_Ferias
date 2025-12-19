package br.com.interfacecurso.view;
import java.util.List;

import br.com.interfacecurso.model.Curso;
import br.com.interfacecurso.service.CursoService;

public class CursoView {
    
    public void exibirCursos() {

        CursoService service = new CursoService();

        try {
            List<Curso> cursos = service.listarCursos();

            if (cursos.isEmpty()) {
                System.out.println("Nenhum curso encontrado.");
                return;
            }

            System.out.println("=== LISTA DE CURSOS ===");

            for (Curso c : cursos) {
                System.out.println(
                        "Código: " + c.getCodigo() +
                        " | Curso: " + c.getCurso() +
                        " | Período: " + c.getPeriodo() +
                        " | Ano: " + c.getAno()
                );
            }

        } catch (Exception e) {
            System.out.println("Erro ao consumir API:"); System.out.println(e.getMessage());
        }
    }

}