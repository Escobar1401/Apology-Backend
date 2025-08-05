// app.js

/*
En este archivo se definen las rutas de la API
*/

import express from 'express'; // Importar express para crear rutas
import 'dotenv/config'; // Importar dotenv para cargar variables de entorno
import cors from 'cors'; // Importar cors para habilitar el acceso a la API desde diferentes origenes
import loginRouter from './routes/login.js'; // Importar el enrutador de login
import authRouter from './routes/login.js'; // Importar el enrutador de autenticación

const app = express(); // Crear una instancia de express
const puerto = process.env.PORT || 3000; // Definir el puerto

// Middleware configuration
app.use(cors());

// Handle JSON bodies
app.use(express.json());

// Handle URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use('/uploads', express.static('public/uploads'));
app.use(express.static('public'));

// Auth routes
app.use('/api/auth', authRouter);

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Bienvenido a la API de Apology',
        endpoints: {
            usuarios: '/api/usuarios',
            materias: '/api/materias',
            grupos: '/api/grupos',
            login: '/api/login',
            email: '/api/email',
            auth: '/api/auth'
        }
    });
});

// Rutas
import usuariosRoutes from './routes/usuarios.routes.js'; // Importar el enrutador de usuarios
import gruposRoutes from './routes/grupos.routes.js'; // Importar el enrutador de grupos
import justificacionesRoutes from './routes/justificaciones.routes.js'; // Importar el enrutador de justificaciones
import emailRoutes from './routes/email.routes.js'; // Importar el enrutador de correos
import materiasRoutes from './routes/materias.routes.js'; // Importar el enrutador de materias

app.use('/api/usuarios', usuariosRoutes); // Usar el enrutador de usuarios
app.use('/api/materias', materiasRoutes);
app.use('/api/grupos', gruposRoutes); // Usar el enrutador de grupos
app.use('/api/login', loginRouter);
app.use('/api/email', emailRoutes);
app.use('/api/justificaciones', justificacionesRoutes); // Usar el enrutador de justificaciones

// Manejo de errores
app.use((req, res) => { 
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

// Iniciar el servidor
app.listen(puerto, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});