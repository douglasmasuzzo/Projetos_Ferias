package br.com.interfacecurso.service; import br.com.interfacecurso.model.Curso;

import java.util.ArrayList; import java.util.List;
import java.net.URI; import java.net.http.HttpClient;
import java.net.http.HttpRequest; import java.net.http.HttpResponse;

public class CursoService {

    private static final String URL = "http://localhost:3000/cursos";

    public List< Curso > listarCursos() throws Exception {

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest
                .newBuilder(URI.create(URL))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("ERRO HTTP: " + response.statusCode());
        }

        return parseJson(response.body());
    }

    private List<Curso> parseJson(String json) {

        List<Curso> cursos = new ArrayList<>();

        json = json.replace("\n", "")
                   .replace("\r", "")
                   .replace("[", "")
                   .replace("]", "")
                   .trim();

        if (json.isEmpty()) return cursos;

        String[] objetos = json.split("\\},\\s*\\{");

        for ( String obj : objetos ) {

            obj = obj.replace("{", "").replace("}", "");
            String[] campos = obj.split(",");

            int codigo = 0; String curso = ""; String periodo = ""; int ano = 0;

            for (String campo : campos) {
                String[] par = campo.split(":");
                
                if (par.length < 2) continue;

                String chave = par[0].replace("\"", "").trim();
                String valor = par[1].replace("\"", "").trim();

                switch (chave) {
                    case "codigo":
                        codigo = Integer.parseInt(valor); break;

                    case "curso":
                        curso = valor; break;

                    case "periodo":
                        periodo = valor; break;

                    case "ano":
                        ano = Integer.parseInt(valor); break;
                }
            }

            cursos.add( new Curso( codigo, curso, periodo, ano ));
        }
        return cursos;
    }
}