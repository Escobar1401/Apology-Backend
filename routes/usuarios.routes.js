// Ruta de usuarios

/*
En este archivo se definen las rutas de usuarios
*/

import express from 'express'; // Importar express para crear rutas
import controller from "../controllers/usuario.controller.js"; // Importar el controlador de usuarios
import validarUsuario from "../middlewares/validarUsuario.js"; // Importar el middleware de validación de usuarios
import validarCambioContraseña from "../middlewares/validarCambioContraseña.js"; // Importar el middleware de validación de cambio de contraseña

const router = express.Router(); // Crear un enrutador

router.get('/', controller.listarUsuarios);
router.get('/:id', controller.obtenerUsuario);
router.get('/rol/:rol', controller.obtenerUsuarioPorRol);
router.post('/', validarUsuario, controller.crearUsuario);
router.put('/:id', validarUsuario, controller.actualizarUsuario);
router.patch('/:id', validarCambioContraseña, controller.cambiarContraseña);
router.patch('/:id/datos', controller.actualizarDatosParciales);
router.delete('/:id', controller.eliminarUsuario);

export default router;
