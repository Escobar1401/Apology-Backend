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

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api/auth', authRouter);

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Bienvenido a la API de Apology',
        endpoints: {
            usuarios: '/api/usuarios',
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
import emailRoutes from './routes/email.routes.js'; // Importar el enrutador de correos

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/login', loginRouter);
app.use('/api/email', emailRoutes);

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