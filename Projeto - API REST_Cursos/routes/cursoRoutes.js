// estrutura de endereços da API

const express = require( 'express' );
const router = express.Router();
const cursosController = require('../controllers/cursoControler');

// listar todos os cursos
router.get( '/', cursosController.listarCursos );

// listar cursos por períodos
router.get( '/periodo/:periodo', cursosController.listarPorPeriodo );

// inserir um novo curso
router.post( '/', cursosController.criarCurso );

module.exports = router;