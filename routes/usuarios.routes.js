// Ruta de usuarios

/*
En este archivo se definen las rutas de usuarios
*/

import express from 'express'; // Importar express para crear rutas
import controller from "../controllers/usuario.controller.js"; // Importar el controlador de usuarios
import validarUsuario from "../middlewares/validarUsuario.js"; // Importar el middleware de validación de usuarios
import validarCambioContraseña from "../middlewares/validarCambioContraseña.js"; // Importar el middleware de validación de cambio de contraseña

const router = express.Router(); // Crear un enrutador

// Listar todos los usuarios
router.get('/', controller.listarUsuarios);
// Obtener un usuario por ID
router.get('/:id', controller.obtenerUsuario);
// Obtener un usuario por Rol
router.get('/rol/:rol', controller.obtenerUsuarioPorRol);
// Crear un nuevo usuario
router.post('/', validarUsuario, controller.crearUsuario);
// Actualizar un usuario
router.put('/:id', validarUsuario, controller.actualizarUsuario);
// Cambiar la contraseña de un usuario
router.patch('/:id', validarCambioContraseña, controller.cambiarContraseña);
// Actualizar solo correo y/o teléfono de un usuario
router.patch('/:id/datos', controller.actualizarDatosParciales);
// Eliminar un usuario
router.delete('/:id', controller.eliminarUsuario);
// Asignar estudiante a tutor legal
router.post('/tutores/estudiantes', controller.asignarEstudianteATutor);
// Obtener el tutor legal de un estudiante
router.get('/estudiantes/:id/tutor-legal', controller.obtenerTutorLegalDeEstudiante);
// Buscar estudiantes (usado por el frontend para asignar tutor legal)
router.get('/search', controller.buscarEstudiantes);

export default router;
