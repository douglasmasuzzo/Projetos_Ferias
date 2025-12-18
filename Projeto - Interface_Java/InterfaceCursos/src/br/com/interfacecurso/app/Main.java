package br.com.interfacecurso.app;
import br.com.interfacecurso.view.TelaCursos;

public class Main {
    public static void main( String[] args ){
        javax.swing.SwingUtilities.invokeLater(TelaCursos :: new );
    }
}

/*
    -> PASSO A PASSO
     - inicie o programa " WAMP "
     - espere a configuração e visualize o status do servidor    
     - abra a pasta do projeto java no vscode
     - abra a pasta do projeto node.js no vscode
     - execute o arquivo.js e acesse o servidor 
     - após a ativação da API, acesse o browser e escreva "http://localhost:3000/cursos" ( arquivo.json )
     - retorne ao projeto java e compile o código principal ( CTRL + f5 )
     - espere inicializar a interface e clique em " carregar informações "
*/

/*
    Após integrar a interface gráfica integrada ao front-end com a biblioteca ' javax.swing ' com o back-end em node.js, o projeto se torna uma aplicação FullStack completa, baseada na arquitetura Cliente-Servidor.

    -> Curso.java ( MODELO DE DADOS )
     
     -- POJO ( Plain Old Java Object )
      + é uma simples classe que serve para carregar os dados, espelhando a estrutura de dados que vem do banco de dados ( via JSON )

     -- ENCAPSULAMENTO
      + utiliza atributos privados e métodos ( GET ) para proteger a integridade dos dados

     -- MAPEAMENTO DE ATRIBUTOS
      + os nomes das variáveis são cruciais para que a biblioteca de conversão ( GSON ) saiba exatamente onde colocar cada valor recebido da API 

    -> CursoService.java ( CONSUMO DE API E INTEGRAÇÃO )
     
     -- HTTPCLIENT
      + utiliza a biblioteca padrão da linguagem para realizar requisições HTTP GET para a URL do servidor node.js ( ' http://localhost:3000/cursos ' )

     -- DESSERIALIZAÇÃO DO JSON
      + a biblioteca GSON transforma o texto bruto ( .JSON ) retornando pela API em objetos reais em JAVA ( List< Cursos > )
      
     -- TYPETOKEN 
      + a linguagem utiliza Generics, recursos necessários para informar ao GSON que ele deve converter o JSON especificament em uma ' List< Curso > ', mantendo a tipagem correta em tempo de execução

     -- TRATAMENTO DE EXCEÇÕES
      + o código verifica se o ' STATUS CODE ' é 200 ( " sucesso " ). Caso contrário, lança uma condição contrária para avisar que a comunicação falhou
      
    -> TelaCursos.java ( INTERFACE GRÁFICA E EVENTOS )

     -- SWING FRAMEWORK
      + utiliza componentes visuais como ' JFrame | JButton | JTable '

     -- DEFAULT TABLE MODEL
      + permite adicionar linhas dinâmicas sempre que os dados são carregados pela API 

     -- PROGRAMAÇÃO ORIENTADA A EVENTOS 
      + o uso de expressões ' lambda ( e -> carregarCursos ) ' define o comportamento dos botões, acionando uma ação ao disparar uma ação

     -- FEEDBACK ao USUÁRIO
      + o uso de JOptionPane garante que o usuário seja avisado caso a API esteja fora do ar ou se nenhum dado for encontrado

    -> Main.java ( INICIALIZAÇÃO e THREADING )

     -- Event Dispatch Thread ( EDT )
      + o método ' SwingUtilities.invookeLate ' é fundamental, garantindo que a interface gráfica seja criada em uma thread específica para a UI, evitando travamentos e comportamentos inesperados na biblioteca swing
      
     -- FLUXO DE EXCEÇÃO
      + o comentário no código detalha a dependência entre os serviços, o banco de dados e a API devem estar ativos antes do programa ser iniciado 
      
*/ 