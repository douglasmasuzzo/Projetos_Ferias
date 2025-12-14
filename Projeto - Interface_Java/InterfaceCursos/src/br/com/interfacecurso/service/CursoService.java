package br.com.interfacecurso.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class CursoService {
    
    private static final String URL = "https://localhost:3030/cursos";

    public static String buscarCursos() throws Exception{
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest
            .newBuilder().uri(URI.create( URL )).GET().build()
        ;    
        HttpResponse< String > response =
            client.send( request, HttpResponse.BodyHandlers.ofString() )
        ;

        return response.body();
    }
}
