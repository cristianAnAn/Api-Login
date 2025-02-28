// src/models/repartidor.model.js
const db = require('../config/database');

// Obtener un repartidor por email (para verificar si existe)
const getRepartidorByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM repartidores WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

// Crear un repartidor con todos los campos
const createRepartidor = async (nombre, email, hashedPassword, sucursal_id, vehiculo_id, estado) => {
  const result = await db.query(
    `INSERT INTO repartidores (nombre, email, password, sucursal_id, vehiculo_id, estado)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nombre, email, hashedPassword, sucursal_id, vehiculo_id, estado]
  );
  // Retorna la fila recién insertada
  return result.rows[0];
};

module.exports = {
  getRepartidorByEmail,
  createRepartidor
};
