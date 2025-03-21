const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de health check
app.get('/health', (req, res) => {
    res.status(200).send('OK'); // Retornar 200 se o serviço estiver OK
  });

module.exports = app;