package br.com.interfacecurso.model;

public class Curso {
    
    private int codigo;
    private int ano;
    private String curso;
    private String periodo;

    public Curso (int codigo, String curso, String periodo, int ano ){
        this.codigo = codigo;
        this.curso = curso;
        this.periodo = periodo;
        this.ano = ano;
    }

    public int getCodigo(){ return codigo; }
    public String getCurso(){ return curso; }
    public String getPeriodo(){ return periodo; }
    public int getAno(){ return ano; }
}
