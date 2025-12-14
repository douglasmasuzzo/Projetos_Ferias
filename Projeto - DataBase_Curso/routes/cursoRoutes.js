// estrutura de endereços da API

const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

// listar todos os cursos
router.get( '/', cursoController.listarCursos );

// listar cursos por períodos
router.get( '/periodo/:periodo', cursoController.listarPorPeriodo );

// inserir um novo curso
router.post( '/', cursoController.criarCursos );

module.exports = router;