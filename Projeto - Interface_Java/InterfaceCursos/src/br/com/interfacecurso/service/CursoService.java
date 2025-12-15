package br.com.interfacecurso.service;

import br.com.interfacecurso.model.Curso;
import com.google.gson.Gson; import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type; import java.net.URI;
import java.net.http.HttpClient; import java.net.http.HttpRequest;
import java.net.http.HttpResponse; import java.util.List;

public class CursoService{

    private static final String URL = "http://localhost:3000/cursos";
    private static final Gson gson = new Gson();

    public static List< Curso > listarCursos() throws Exception {

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.
            newBuilder( URI.create( URL ) ).GET().build()
        ;

        HttpResponse< String > response =
            client.send( request, HttpResponse.BodyHandlers.ofString() );

        if ( response.statusCode() != 200 ){
            throw new RuntimeException( "ERRO HTTP : " + response.statusCode() );
        }

        Type listType = new TypeToken< List< Curso >>(){}.getType();
        return gson.fromJson( response.body() , listType );
    }
}

