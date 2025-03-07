// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getRepartidorByEmail, createRepartidor } = require('../models/repartidor.model');
// 📌 Registro de usuario (ya lo tienes)
const register = async (req, res) => {
  try {
    const { nombre, email, password, sucursal_id, vehiculo_id, estado } = req.body;

    const existingRepartidor = await getRepartidorByEmail(email);
    if (existingRepartidor) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newRepartidor = await createRepartidor(
      nombre, email, hashedPassword, sucursal_id, vehiculo_id, estado
    );

    const { password: _, ...repartidorData } = newRepartidor;
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      repartidor: repartidorData
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 📌 Login de usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const repartidor = await getRepartidorByEmail(email);
    if (!repartidor) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, repartidor.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generamos el token JWT
    const token = jwt.sign(
      { id: repartidor.id_repartidor, email: repartidor.email },
      process.env.JWTSECRET,
      { expiresIn: '1h' }
    );
    res.set('Authorization', `Bearer ${token}`);
    // Enviamos el token al cliente
    // res.json({
    //   message: 'Token generado, envíalo para verificar el login',
    //   token
    // });
    res.json({
      message: 'Token generado y enviado en la cabecera'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Verificación del token recibido del cliente (puedes dejarlo igual o ajustar según tu flujo)
const verificarToken = (req, res) => {
  // Ahora supongamos que el token se envía en el header "Authorization"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ message: 'Token no proporcionado en la cabecera' });
  }
  // Se extrae el token del header (se espera formato "Bearer <token>")
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'Token mal formado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    return res.json({ message: 'Token verificado. Login exitoso'});
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = {
  register,
  login,
  verificarToken // Asegúrate de exportar la función
};