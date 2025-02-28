// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // Registrar errores
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Registrar todo
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Mostrar logs en consola si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
