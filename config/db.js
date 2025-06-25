/* Configuración de la base de datos
En este archivo se define la conexión a la base de datos
*/

import mysql2 from 'mysql2'; // Importar mysql2 para la conexión a la base de datos
import dotenv from 'dotenv'; // Importar dotenv para cargar variables de entorno

dotenv.config(); // Cargar variables de entorno

// Crear la conexión a la base de datos
const connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('✅ Conectado a la base de datos Apology');
    }
});

// Exportar la conexión
export default connection;
