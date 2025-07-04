// Rutas para manejar las operaciones de grupos y grados

import express from 'express';
import controller from "../controllers/grupo.controller.js";

const router = express.Router();

// Obtener todos los grados
router.get('/grados', controller.listarGrados);

// Obtener grupos por grado
router.get('/grados/:gradoId/grupos', controller.obtenerGruposPorGrado);

// Obtener estudiantes por grupo (ruta simplificada)
router.get('/grupos/:grupoId/estudiantes', controller.obtenerEstudiantesPorGrupo);

// Asignar un estudiante a un grupo (ruta simplificada)
router.post('/estudiantes-grupo', controller.asignarEstudiante);

export default router;
