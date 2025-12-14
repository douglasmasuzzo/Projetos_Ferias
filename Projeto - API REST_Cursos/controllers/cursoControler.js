// gerenciamento do sistema

const db = require( '../db' );

// GET /cursos
exports.listarCursos = async ( req , res ) => {
    try {
        const [rows] = await db.query('SELECT * FROM cursos'); res.json( rows );
    } catch ( error ){
        res.status( 500 ).json( { erro : 'ERRO AO BUSCAR TABELA "CURSOS" ' } ); 
    }
};

// GET /cursos/periodo/:periodo
exports.listarPorPeriodo = async ( req, res ) => {
    const { periodo } = req.params;

    try {
        const [ rows ] = await db.query(
            ' SELEC * FROM cursos WHERE periodo = ? ', periodo );
        res.json( rows );
    } catch ( error ) {
        res.status( 500 ).json( { erro : 'ERRO AO FILTRAR CURSOS '});
    }
};

// POST /cursos
exports.criarCursos = async ( req , res ) => {
    const { codigo , curso , periodo , materias, horas, duracao, ano } = req.body;
    
    if ( !curso || !periodo ) {
        return res.status( 400 ).json( { erro : ' CURSO E PERÍODO SÃO OBRIGATÓRIOS '});
    }

    try {
        await db.query(
            `INSERT INTO cursos 
                ( codigo, curso, periodo, materias, horas, duracao, ano ) 
                    VALUES ( ?, ?, ?, ?, ?, ?, ? )`, 
                    [ codigo, curso, periodo, materias, horas, duracao, ano ]
        );

        res.status( 201 ).json( { mensagem : 'CURSO CADASTRADO COM SUCESSO '} );
    } catch ( error ){
        res.status(500).json({ erro: 'ERRO AO INSEIR O CURSO' });
    }
};
