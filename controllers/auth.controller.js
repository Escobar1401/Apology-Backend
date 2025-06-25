/* Controlador de autenticación
En este archivo se definen las operaciones de autenticación
*/

import bcrypt from 'bcrypt'; // Importar bcrypt para la comparación de contraseñas
import jwt from 'jsonwebtoken'; // Importar jwt para la generación de tokens
import connection from '../config/db.js'; // Importar la conexión a la base de datos

const authController = {
    login: function(req, res) {
        const { correo, contraseña } = req.body;
        
        // Validar que se proporcionen correo y contraseña
        if (!correo || !contraseña) {
            return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
        }

        // Buscar el usuario por correo
        console.log('Buscando usuario:', correo);
        connection.query(`SELECT * FROM usuario WHERE correo = ?`, [correo], (err, results) => {
            
            // Manejar errores de la consulta
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.status(500).json({ mensaje: 'Error de servidor' });
            }

            // Verificar si se encontró el usuario
            if (results.length === 0) {
                console.log('Usuario no encontrado');
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }

            // Extraer el usuario
            const usuario = results[0];
            console.log('Usuario encontrado:', {
                id: usuario.id,
                correo: usuario.correo,
                estado: usuario.estado,
                intentosFallidos: usuario.intentosFallidos,
                rol: usuario.rol
            });
            
            // Verificar si la cuenta está activa
            if (usuario.estado !== 'Activo') {
                console.log('Cuenta desactivada');
                return res.status(401).json({ mensaje: 'Cuenta desactivada' });
            }

            // Verificar la contraseña
            bcrypt.compare(contraseña, usuario.contraseña, (err, validPassword) => {
                
                // Manejar errores de la comparación
                if (err) {
                    console.error('Error al comparar contraseña:', err);
                    return res.status(500).json({ mensaje: 'Error de servidor' });
                }

                // Verificar si la contraseña es válida
                if (!validPassword) {
                    console.log('Contraseña inválida');
                    console.log('la contraseña del usuario es: ', usuario.contraseña);
                    console.log('la contraseña ingresada es: ', contraseña);
                    // Incrementar intentos fallidos
                    const intentos = usuario.intentosFallidos || 0;
                    const nuevosIntentos = intentos + 1;
                    
                    console.log('Incrementando intentos fallidos:', nuevosIntentos, "\n Quedan", 3 - nuevosIntentos, "intentos");
                    // Actualizar intentos fallidos
                    connection.query(
                        'UPDATE usuario SET intentosFallidos = ? WHERE id = ?',
                        [nuevosIntentos, usuario.id],
                        (err) => {
                            if (err) {
                                console.error('Error al actualizar intentos:', err);
                            }
                        }
                    );

                    // Bloquear la cuenta después de 3 intentos fallidos
                    if (nuevosIntentos >= 3) {
                        console.log('Bloqueando cuenta por múltiples intentos fallidos');
                        connection.query(
                            'UPDATE usuario SET estado = ? WHERE id = ?',
                            ['Bloqueado', usuario.id],
                            (err) => {
                                if (err) {
                                    console.error('Error al bloquear cuenta:', err);
                                }
                            }
                        );
                        return res.status(401).json({ mensaje: 'Cuenta bloqueada por múltiples intentos fallidos' });
                    }
                    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
                }

                console.log('Contraseña válida');
                // Resetear intentos fallidos
                connection.query(
                    'UPDATE usuario SET intentosFallidos = 0 WHERE id = ?',
                    [usuario.id],
                    (err) => {
                        if (err) {
                            console.error('Error al resetear intentos:', err);
                        }
                    }
                );

                // Crear token JWT
                const token = jwt.sign(
                    { id: usuario.id, rol: usuario.rol },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                console.log('Generando token JWT');
                res.json({
                    status: 'success',
                    token,
                    rol: usuario.rol
                });
            });
        });
    }
};

export default authController;
