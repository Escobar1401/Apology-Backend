// Modelo de materias

/*
En este archivo se definen las operaciones CRUD para las materias
*/

import db from "../config/db.js";

const materiasModel = {
    obtenerMaterias: (callback) => {
        const query = "SELECT * FROM materias";
        db.query(query, callback);
    },
    obtenerMateriaPorId: (id, callback) => {
        const query = "SELECT * FROM materias WHERE id = ?";
        db.query(query, [id], callback);
    },
    obtenerMateriaPorNombre: (nombre, callback) => {
        const query = "SELECT * FROM materias WHERE nombre = ?";
        db.query(query, [nombre], callback);
    },
    crearMateria: (materia, callback) => {
        const query = "INSERT INTO materias SET ?";
        db.query(query, materia, callback);
    },
    actualizarMateria: (id, materia, callback) => {
        const query = "UPDATE materias SET ? WHERE id = ?";
        db.query(query, [materia, id], callback);
    },
    eliminarMateria: (id, callback) => {
        const query = "DELETE FROM materias WHERE id = ?";
        db.query(query, [id], callback);
    },
};

export default materiasModel;