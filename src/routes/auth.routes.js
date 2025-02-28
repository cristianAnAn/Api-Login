// src/routes/auth.routes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, verificarToken } = require('../controllers/auth.controller');

const router = express.Router();

// Middleware para validar y retornar errores si existen
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Retorna un arreglo con los errores encontrados
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Ruta de registro con validaciones
router.post(
  '/register',
  [
    body('nombre')
      .notEmpty().withMessage('El nombre es obligatorio'),
    body('email')
      .isEmail().withMessage('Debe ser un email válido'),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('sucursal_id')
      .isNumeric().withMessage('El ID de sucursal debe ser numérico'),
    body('vehiculo_id')
      .isNumeric().withMessage('El ID de vehículo debe ser numérico'),
    body('estado')
      .notEmpty().withMessage('El estado es obligatorio')
  ],
  validateRequest,
  register
);

// Ruta de login con validaciones
router.post(
  '/login',
  [
    body('email')
      .isEmail().withMessage('Debe ser un email válido'),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
  ],
  validateRequest,
  login
);

router.post(
  '/verify',
  [
    body('token').notEmpty().withMessage('El token es obligatorio')
  ],
  validateRequest,
  verificarToken
);

module.exports = router;
