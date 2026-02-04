import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de health check
app.get('/health', (req, res) => {
    res.status(200).send('OK'); // Retornar 200 se o serviço estiver OK
  });

export default app;