// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
require('dotenv').config();

const app = express();

// 📌 Configuración de seguridad
app.use(cors({
  credentials: true,
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],  // Ajusta según dónde corra tu app React Native o tu Postman
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 📌 Rutas
app.use('/api/auth', authRoutes);

module.exports = app;

