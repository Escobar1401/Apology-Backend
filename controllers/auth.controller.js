/* Controlador de autenticación
En este archivo se definen las operaciones de autenticación.
Este código sirve para que el usuario pueda iniciar sesión, verificar si un correo existe,
solicitar recuperación de contraseña, validar el token de recuperación y restablecer la contraseña.
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
    },

    // Función para verificar si un correo existe
    checkEmail: function(req, res) {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ mensaje: 'El correo es requerido' });
        }

        connection.query('SELECT id, correo FROM usuario WHERE correo = ?', [email], (err, results) => {
            if (err) {
                console.error('Error al verificar el correo:', err);
                return res.status(500).json({ mensaje: 'Error del servidor al verificar el correo' });
            }

            if (results.length === 0) {
                return res.status(404).json({ mensaje: 'Este correo electrónico no se encuentra registrado' });
            }

            res.status(200).json({ 
                mensaje: 'Correo verificado exitosamente',
                email: results[0].correo
            });
        });
    },

    // Función para generar token de recuperación
    forgotPassword: function(req, res) {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ mensaje: 'El correo es requerido' });
        }

        // Verificar si el usuario existe
        connection.query('SELECT id, correo FROM usuario WHERE correo = ?', [email], (err, results) => {
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.status(500).json({ mensaje: 'Error del servidor' });
            }

            if (results.length === 0) {
                return res.status(404).json({ mensaje: 'Este correo electrónico no se encuentra registrado' });
            }

            const user = results[0];
            
            // Generar token de recuperación (válido por 1 hora)
            const token = jwt.sign(
                { userId: user.id, email: user.correo },
                process.env.JWT_SECRET || 'tu_clave_secreta',
                { expiresIn: '1h' }
            );

            // Guardar el token en la base de datos
            const expiresAt = new Date(Date.now() + 3600000); // 1 hora a partir de ahora
            
            connection.query(
                'UPDATE usuario SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
                [token, expiresAt, user.id],
                (err) => {
                    if (err) {
                        console.error('Error al guardar el token de recuperación:', err);
                        return res.status(500).json({ mensaje: 'Error al generar el token de recuperación' });
                    }

                    res.status(200).json({ 
                        mensaje: 'Token generado exitosamente',
                        token: token
                    });
                }
            );
        });
    },

    // Función para validar el token de recuperación
    validateResetToken: function(req, res) {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ mensaje: 'Token no proporcionado' });
        }

        // Verificar el token JWT
        jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta', (jwtErr, decoded) => {
            if (jwtErr) {
                console.error('Error al verificar el token JWT:', jwtErr);
                return res.status(401).json({ mensaje: 'Token inválido o expirado' });
            }

            // Verificar si el token existe en la base de datos y no ha expirado
            connection.query(
                'SELECT id, correo FROM usuario WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
                [token, new Date()],
                (err, results) => {
                    if (err) {
                        console.error('Error al verificar el token en la base de datos:', err);
                        return res.status(500).json({ mensaje: 'Error al validar el token' });
                    }

                    if (results.length === 0) {
                        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
                    }

                    const user = results[0];
                    res.status(200).json({ 
                        mensaje: 'Token válido',
                        email: user.correo
                    });
                }
            );
        });
    },

    resetPassword: function(req, res) {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ mensaje: 'Token y nueva contraseña son requeridos' });
        }
    
        if (newPassword.length < 8) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres' });
        }
    
        // Verificar el token JWT
        jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta', (jwtErr, decoded) => {
            if (jwtErr) {
                console.error('Error al verificar el token JWT:', jwtErr);
                return res.status(401).json({ mensaje: 'Token inválido o expirado' });
            }
    
            // Verificar si el token existe en la base de datos y no ha expirado
            connection.query(
                'SELECT id, correo FROM usuario WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
                [token, new Date()],
                (err, results) => {
                    if (err) {
                        console.error('Error al buscar el token en la base de datos:', err);
                        return res.status(500).json({ mensaje: 'Error al validar el token' });
                    }
    
                    if (results.length === 0) {
                        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
                    }
    
                    const user = results[0];
                    
                    // Hashear la nueva contraseña
                    bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
                        if (hashErr) {
                            console.error('Error al hashear la contraseña:', hashErr);
                            return res.status(500).json({ mensaje: 'Error al procesar la contraseña' });
                        }
    
                        // Actualizar la contraseña y limpiar el token
                        connection.query(
                            'UPDATE usuario SET contraseña = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
                            [hashedPassword, user.id],
                            (updateErr) => {
                                if (updateErr) {
                                    console.error('Error al actualizar la contraseña:', updateErr);
                                    return res.status(500).json({ mensaje: 'Error al actualizar la contraseña' });
                                }
    
                                res.status(200).json({ 
                                    mensaje: 'Contraseña actualizada exitosamente' 
                                });
                            }
                        );
                    });
                }
            );
        });
    }
};

export default authController;
