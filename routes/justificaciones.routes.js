// rutas de justificaciones de inasistencias

import express from 'express'; // Importar express para crear rutas
import controller from "../controllers/justificacion.controller.js"; // Importar el controlador de justificaciones
import validarJustificacion from "../middlewares/validarJustificacion.js"; // Importar el middleware de validación de justificaciones
import upload from '../config/multer.config.js';

const router = express.Router(); // Crear un enrutador

// Middleware para parsear JSON y urlencoded data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Listar todas las justificaciones
router.get('/', controller.listarJustificaciones);

// Obtener una justificacion por ID
router.get('/:id', controller.obtenerJustificacion);

// Obtener justificaciones por ID de estudiante
router.get('/estudiante/:estudianteId', controller.obtenerJustificacionesPorEstudiante);

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    return res.status(400).json({
      error: 'Error al procesar el archivo',
      details: err.message
    });
  }
  next();
};

// Crear una nueva justificacion con manejo de archivos
router.post('/',
  (req, res, next) => {
    console.log('Incoming request headers:', req.headers);
    console.log('Content-Type:', req.get('Content-Type'));
    next();
  },
  upload.single('archivo'),
  handleMulterError,
  (req, res, next) => {
    console.log('After multer - Request body:', req.body);
    console.log('File:', req.file);
    next();
  },
  validarJustificacion,
  controller.crearJustificacion
);

// Actualizar una justificacion
router.put('/:id',
  upload.single('archivo'),
  handleMulterError,
  validarJustificacion,
  controller.actualizarJustificacion
);

// Eliminar una justificacion
router.delete('/:id', controller.eliminarJustificacion);

export default router;

