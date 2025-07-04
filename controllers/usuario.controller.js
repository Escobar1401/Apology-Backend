/* Controlador de usuarios
En este archivo se definen las operaciones de usuarios.
Este código sirve para que el usuario pueda iniciar sesión, verificar si un correo existe,
solicitar recuperación de contraseña, validar el token de recuperación y restablecer la contraseña.
*/

import usuarioController from "../models/usuarios.model.js"; // Importar el controlador de usuarios
import bcrypt from 'bcrypt';
import usuariosModel from '../models/usuarios.model.js'; // Importar bcrypt para hashear contraseñas

const controller = {
    // Obtener todos los Usuarios
    listarUsuarios: (req, res) => {
        usuarioController.obtenerUsuarios((err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },

    // Obtener un usuario por ID
    obtenerUsuario: (req, res) => {
        const id = req.params.id;
        usuarioController.obtenerUsuarioPorId(id, (err, filas) => {
            if (err) return res.status(500).json(err);
            if (filas.length === 0) return res.status(404).json({ mensaje: 'No encontrada' });
            res.json(filas[0]);
        });
    },

    // Crear un nuevo usuario
    crearUsuario: (req, res) => {
        const datos = req.body;

        bcrypt.hash(datos.contraseña, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ mensaje: 'Error al hashear la contraseña' });
            }

            const datosConHash = { ...datos, contraseña: hashedPassword };

            usuarioController.crearUsuario(datosConHash, (err, resultado) => {
                if (err) return res.status(500).json(err);
                res.status(201).json({ id: resultado.insertId, ...datos });
            });
        });
    },

    // Actualizar un usuario
    actualizarUsuario: (req, res) => {
        const id = req.params.id;
        const datos = req.body;

        usuarioController.actualizarUsuario(id, datos, (err, resultado) => {
            if (err) return res.status(500).json(err);
            res.json({ mensaje: 'Actualizado con éxito', ...datos });
        });
    },

    // Cambiar la contraseña de un usuario
    cambiarContraseña: (req, res) => {
        const id = req.params.id;
        const { contraseñaActual, nuevaContraseña } = req.body;

        usuariosModel.obtenerUsuarioPorId(id, (err, filas) => {
            if (err) {
                console.error("Error al buscar usuario:", err);
                return res.status(500).json({ mensaje: 'Error al buscar el usuario', error: err });
            }
            if (filas.length === 0) {
                console.warn("Usuario no encontrado:", id);
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            const usuario = filas[0];

            // Verificar contraseña actual
            bcrypt.compare(contraseñaActual, usuario.contraseña, (err, esValida) => {
                if (err) {
                    console.error("Error al comparar contraseñas:", err);
                    return res.status(500).json({ mensaje: 'Error al verificar la contraseña', error: err });
                }
                if (!esValida) {
                    console.warn("Contraseña actual incorrecta para usuario:", id);
                    return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
                }

                // Hashear nueva contraseña y actualizar
                bcrypt.hash(nuevaContraseña, 10, (err, hash) => {
                    if (err) {
                        console.error("Error al hashear nueva contraseña:", err);
                        return res.status(500).json({ mensaje: 'Error al hashear la nueva contraseña', error: err });
                    }
                    usuariosModel.actualizarContrasena(id, hash, (err, resultado) => {
                        if (err) {
                            console.error("Error al actualizar la contraseña:", err);
                            return res.status(500).json({ mensaje: 'Error al actualizar la contraseña', error: err });
                        }
                        res.json({ mensaje: 'Contraseña actualizada correctamente' });
                    });
                });
            });
        });
    },

    // Actualizar solo correo y/o teléfono de un usuario
    actualizarDatosParciales: (req, res) => {
        const id = req.params.id;
        const { correo, telefono, contraseñaActual } = req.body;

        if (!contraseñaActual) {
            return res.status(400).json({ mensaje: 'Debe ingresar la contraseña actual para confirmar los cambios.' });
        }

        if (!correo && !telefono) {
            return res.status(400).json({ mensaje: 'Debe enviar al menos un campo a actualizar (correo o teléfono).' });
        }

        const campos = {};
        if (correo) {
            if (!/^[\w-.]+@ieluiscarlosgalansarmiento\.edu\.co$/.test(correo)) {
                return res.status(400).json({ mensaje: 'Correo inválido.' });
            }
            campos.correo = correo;
        }
        if (telefono) {
            if (!/^[0-9]{10}$/.test(telefono)) {
                return res.status(400).json({ mensaje: 'Teléfono inválido.' });
            }
            campos.telefono = telefono;
        }

        // Verificar contraseña antes de actualizar
        usuariosModel.obtenerUsuarioPorId(id, (err, filas) => {
            if (err) {
                return res.status(500).json({ mensaje: 'Error al buscar el usuario', error: err });
            }
            if (filas.length === 0) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            const usuario = filas[0];
            const hashAlmacenado = usuario.contraseña;
            // Verifica contraseña actual
            bcrypt.compare(contraseñaActual, hashAlmacenado, (err, esValida) => {
                if (err) {
                    return res.status(500).json({ mensaje: 'Error al verificar la contraseña', error: err });
                }
                if (!esValida) {
                    return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
                }
                // Si la contraseña es válida, actualiza los campos
                usuarioController.actualizarDatosParciales(id, campos, (err, resultado) => {
                    if (err) return res.status(500).json(err);
                    res.json({ mensaje: 'Datos actualizados correctamente', ...campos });
                });
            });
        });
    },

    // Buscar estudiantes
    buscarEstudiantes: (req, res) => {
        const { q } = req.query;
        
        if (!q || q.length < 3) {
            return res.status(400).json({ 
                mensaje: 'El término de búsqueda debe tener al menos 3 caracteres' 
            });
        }

        usuariosModel.buscarEstudiantes(q, (err, resultados) => {
            if (err) {
                console.error('Error en búsqueda de estudiantes:', err);
                return res.status(500).json({ 
                    mensaje: 'Error al buscar estudiantes',
                    error: err.message 
                });
            }
            res.json(resultados);
        });
    },

    // Asignar estudiante a tutor
    asignarEstudianteATutor: (req, res) => {
        const tutorId = req.params.id;
        const { estudiante_id } = req.body;

        if (!estudiante_id) {
            return res.status(400).json({ 
                mensaje: 'El ID del estudiante es requerido' 
            });
        }

        // Verificar que el tutor existe y es un TutorLegal
        usuariosModel.obtenerUsuarioPorId(tutorId, (err, tutor) => {
            if (err || !tutor || tutor.length === 0) {
                return res.status(404).json({ 
                    mensaje: 'Tutor no encontrado' 
                });
            }

            if (tutor[0].rol !== 'TutorLegal') {
                return res.status(400).json({ 
                    mensaje: 'El usuario especificado no es un Tutor Legal' 
                });
            }

            // Verificar que el estudiante existe
            usuariosModel.obtenerUsuarioPorId(estudiante_id, (err, estudiante) => {
                if (err || !estudiante || estudiante.length === 0) {
                    return res.status(404).json({ 
                        mensaje: 'Estudiante no encontrado' 
                    });
                }

                if (estudiante[0].rol !== 'Estudiante') {
                    return res.status(400).json({ 
                        mensaje: 'El usuario especificado no es un Estudiante' 
                    });
                }

                // Asignar estudiante al tutor
                usuariosModel.asignarEstudianteATutor(
                    tutorId, 
                    estudiante_id, 
                    (err, resultado) => {
                        if (err) {
                            console.error('Error al asignar estudiante a tutor:', err);
                            return res.status(500).json({ 
                                mensaje: 'Error al asignar estudiante al tutor',
                                error: err.message 
                            });
                        }
                        
                        res.status(201).json({ 
                            mensaje: 'Estudiante asignado al tutor exitosamente',
                            tutor_id: tutorId,
                            estudiante_id: estudiante_id
                        });
                    }
                );
            });
        });
    },

    // Eliminar un usuario
    eliminarUsuario: (req, res) => {
        const id = req.params.id;
        usuarioController.eliminarUsuario(id, (err, resultado) => {
            if (err) return res.status(500).json(err);
            res.json({ mensaje: 'Eliminado con éxito' });
        });
    },
};

export default controller;