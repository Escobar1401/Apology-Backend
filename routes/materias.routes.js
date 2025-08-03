// Ruta de materias

/*
En este archivo se definen las rutas de materias
*/

import express from 'express'; // Importar express para crear rutas
import controller from "../controllers/materia.controller.js"; // Importar el controlador de materias

const router = express.Router(); // Crear un enrutador

router.get('/', controller.listarMaterias);
router.get('/:id', controller.obtenerMateria);
router.get('/nombre/:nombre', controller.obtenerMateriaPorNombre);
router.post('/', controller.crearMateria);
router.put('/:id', controller.actualizarMateria);
router.delete('/:id', controller.eliminarMateria);

export default router;
