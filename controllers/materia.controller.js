/* Controlador de materias
Este es el controlador de materias.

Funcionalidades:
- Listar todas las materias
- Obtener una materia por ID
- Obtener una materia por nombre
- Crear una nueva materia
- Actualizar una materia
- Eliminar una materia
*/ 

import materiasModel from "../models/materias.model.js";

const controllerMaterias = {
    // Listar todas las Materias
    listarMaterias: (req, res) => { 
        materiasModel.obtenerMaterias((err, resultados) => {
            if (err) return res.status(500).send(err); // Si hay un error, retorna el error
            res.json(resultados); // Retorna todas las materias
        });
    },
    // Obtener una materia por ID
    obtenerMateria: (req, res) => {
        const id = req.params.id;
        materiasModel.obtenerMateriaPorId(id, (err, filas) => {
            if (err) return res.status(500).json(err); // Si hay un error, retorna el error
            if (filas.length === 0) return res.status(404).json({ mensaje: 'No encontrada' }); // Si no se encuentra la materia, retorna un mensaje
            res.json(filas[0]); // Retorna la materia
        });
    },
    // Obtener una materia por nombre
    obtenerMateriaPorNombre: (req, res) => {
        const nombre = req.params.nombre;
        materiasModel.obtenerMateriaPorNombre(nombre, (err, filas) => {
            if (err) return res.status(500).json(err); // Si hay un error, retorna el error
            if (filas.length === 0) return res.status(404).json({ mensaje: 'No encontrada' }); // Si no se encuentra la materia, retorna un mensaje
            res.json(filas[0]); // Retorna la materia
        });
    },
    // Crear una Materia
    crearMateria: (req, res) => {
        const datos = req.body;
        materiasModel.crearMateria(datos, (err, resultado) => {
            if (err) return res.status(500).json(err); // Si hay un error, retorna el error
            res.json({ mensaje: 'Creado con éxito', ...datos }); // Retorna la materia creada
        });
    },
    // Actualizar una Materia
    actualizarMateria: (req, res) => {
        const id = req.params.id;
        const datos = req.body;
        materiasModel.actualizarMateria(id, datos, (err, resultado) => {
            if (err) return res.status(500).json(err); // Si hay un error, retorna el error
            res.json({ mensaje: 'Actualizado con éxito', ...datos }); // Retorna la materia actualizada
        });
    },
    // Eliminar una Materia
    eliminarMateria: (req, res) => {
        const id = req.params.id;
        materiasModel.eliminarMateria(id, (err, resultado) => {
            if (err) return res.status(500).json(err); // Si hay un error, retorna el error
            res.json({ mensaje: 'Eliminado con éxito' }); // Retorna un mensaje
        });
    },
};

export default controllerMaterias;