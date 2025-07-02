// Ruta de autenticación y recuperación de contraseña

/*
En este archivo se definen las rutas de autenticación y recuperación de contraseña.
Este código sirve para que el usuario pueda iniciar sesión, verificar si un correo existe,
solicitar recuperación de contraseña, validar el token de recuperación y restablecer la contraseña.
*/

import express from 'express'; // Importar express para crear rutas
import authController from '../controllers/auth.controller.js'; // Importar el controlador de autenticación

const router = express.Router(); // Crear un enrutador

// Ruta para iniciar sesión
router.post('/', authController.login);

// Ruta para verificar si un correo existe
router.post('/check-email', authController.checkEmail);

// Ruta para solicitar recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);

// Ruta para validar el token de recuperación
router.get('/validate-reset-token', authController.validateResetToken);

// Ruta para restablecer la contraseña
router.post('/reset-password', authController.resetPassword);

export default router;
