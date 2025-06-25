// Rutas para manejar las operaciones de grupos

import express from 'express';
import controller from "../controllers/grupo.controller.js";

const router = express.Router();

// Obtener todos los grupos
router.get('/', controller.listarGrupos);

// Asignar un estudiante a un grupo
router.post('/estudiantes-grupo', controller.asignarEstudiante);

export default router;
