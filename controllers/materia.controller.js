// Controlador de materias

/*
En este archivo se definen los controladores de materias
*/

import materiasModel from "../models/materias.model.js";

const controllerMaterias = {
    // Obtener todas las Materias
    listarMaterias: (req, res) => {
        materiasModel.obtenerMaterias((err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
    // Obtener materias por ID
    obtenerMateria: (req, res) => {
        const id = req.params.id;
        materiasModel.obtenerMateriaPorId(id, (err, filas) => {
            if (err) return res.status(500).json(err);
            if (filas.length === 0) return res.status(404).json({ mensaje: 'No encontrada' });
            res.json(filas[0]);
        });
    },
    // Obtener materias por nombre
    obtenerMateriaPorNombre: (req, res) => {
        const nombre = req.params.nombre;
        materiasModel.obtenerMateriaPorNombre(nombre, (err, filas) => {
            if (err) return res.status(500).json(err);
            if (filas.length === 0) return res.status(404).json({ mensaje: 'No encontrada' });
            res.json(filas[0]);
        });
    },
    // Crear una Materia
    crearMateria: (req, res) => {
        const datos = req.body;
        materiasModel.crearMateria(datos, (err, resultado) => {
            if (err) return res.status(500).json(err);
            res.json({ mensaje: 'Creado con éxito', ...datos });
        });
    },
    // Actualizar una Materia
    actualizarMateria: (req, res) => {
        const id = req.params.id;
        const datos = req.body;
        materiasModel.actualizarMateria(id, datos, (err, resultado) => {
            if (err) return res.status(500).json(err);
            res.json({ mensaje: 'Actualizado con éxito', ...datos });
        });
    },
    // Eliminar una Materia
    eliminarMateria: (req, res) => {
        const id = req.params.id;
        materiasModel.eliminarMateria(id, (err, resultado) => {
            if (err) return res.status(500).json(err);
            res.json({ mensaje: 'Eliminado con éxito' });
        });
    },
};

export default controllerMaterias;