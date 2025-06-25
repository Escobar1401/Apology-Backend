// Ruta de login

/*
En este archivo se definen las rutas de autenticación
*/

import express from 'express'; // Importar express para crear rutas
import authController from '../controllers/auth.controller.js'; // Importar el controlador de autenticación

const router = express.Router(); // Crear un enrutador

router.post('/', authController.login); // Definir la ruta de login

export default router;  // Exportar el enrutador
