const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;