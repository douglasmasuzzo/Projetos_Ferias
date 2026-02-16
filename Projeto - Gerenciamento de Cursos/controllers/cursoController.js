// gerenciamento do sistema

const db = require('../db');

// GET /cursos
exports.listarCursos = async ( req, res, next ) => {
    try{
        const [ rows ] = await db.query('SELECT * FROM cursos');
        res.status( 200 ).json( rows );
    } catch ( error ) {
        next( error );
    }
};

// GET /cursos/periodo/:periodo
exports.listarPorPeriodo = async ( req, res, next ) => {
    const { periodo } = req.params;

    const periodos = [ 'MANHÃ', 'TARDE', 'NOITE' ];
    
    if ( !periodos.includes( periodo ) ){
        return res.status( 400 ).json({
            erro: 'PERÍODO INVÁLIDO. VALORES DEFINIDOS: "MANHÃ / TARDE / NOITE'
        });
    }
    
    try{
        const [ rows ] = await db.query(
            'SELECT * FROM cursos WHERE periodo = ?', [ periodo ]
        );
        
        res.status( 200 ).json( rows );
        
    } catch ( error ) {
        next( error );
    }   
};

// POST /cursos
exports.criarCursos = async (req, res, next) => {
    try {

        if (!req.body) {
            return res.status(400).json({
                erro: 'BODY DA REQUISIÇÃO NÃO ENVIADO'
            });
        }

        const { curso, periodo, materias, horas, semestre, ano } = req.body;
        const periodos = ['MANHÃ', 'TARDE', 'NOITE'];

        if (!curso || !periodo) {
            return res.status(400).json({
                erro: 'CURSO E PERÍODO SÃO OBRIGATÓRIOS'
            });
        }

        if (!periodos.includes(periodo)) {
            return res.status(400).json({
                erro: 'PERÍODO INVÁLIDO. VALORES DEFINIDOS: MANHÃ / TARDE / NOITE'
            });
        }

        const query = `
            INSERT INTO cursos
            (curso, periodo, materias, horas, semestre, ano)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            curso,
            periodo,
            materias ?? null,
            horas ?? null,
            semestre ?? null,
            ano ?? null
        ];

        await db.query(query, values);

        res.status(201).json({
            mensagem: 'CURSO CADASTRADO COM SUCESSO'
        });

    } catch (error) {
        next(error);
    }
};