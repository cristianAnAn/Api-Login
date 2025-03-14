// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getRepartidorByEmail, createRepartidor, getRepartidorById } = require('../models/repartidor.model');

// 📌 Registro de usuario
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

    // Excluimos la contraseña de la respuesta
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
    
    // Configuramos la cabecera para exponer el token
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    res.set('Authorization', `Bearer ${token}`);
    
    // Enviamos únicamente el mensaje, el token queda en la cabecera
    res.json({
      message: 'Token generado'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 📌 Verificación del token y envío de datos del usuario
const verificarToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ message: 'Token no proporcionado en la cabecera' });
  }

  // Se espera el formato "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'Token mal formado' });
  }

  try {
    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    // Obtenemos los datos del usuario a partir del ID contenido en el token
    const repartidor = await getRepartidorById(decoded.id);
    if (!repartidor) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Excluimos la contraseña de los datos a enviar
    const { password, ...userData } = repartidor;

    // Enviamos la respuesta con el mensaje y los datos del usuario
    return res.json({
      message: 'Token verificado. Login exitoso',
      user: userData
    });
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = {
  register,
  login,
  verificarToken
};
