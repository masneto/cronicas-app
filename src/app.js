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
    res.status(200).send('OK');
  });

// Proxy contador de visitas (evita CORS no browser)
app.get('/api/visitas', async (req, res) => {
  try {
    const response = await fetch('https://api.counterapi.dev/v1/cronicas-nadaver/visitas/up');
    const data = await response.json();
    res.json({ count: data.count });
  } catch {
    res.status(500).json({ count: null });
  }
});

export default app;