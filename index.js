const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const articlesRouter = require('./routes/articles');
app.use('/api/articles', articlesRouter);

// Fonction pour trouver un port disponible
function findAvailablePort(port) {
  const http = require('http');
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} déjà utilisé, tentative avec le port ${port + 1}...`);
        resolve(findAvailablePort(port + 1));
      } else {
        reject(err);
      }
    });
    server.listen(port, () => {
      server.close(() => {
        resolve(port);
      });
    });
  });
}

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
findAvailablePort(PORT)
  .then(availablePort => {
    app.listen(availablePort, () => {
      console.log(`Serveur démarré sur le port ${availablePort}`);
    });
  })
  .catch(err => {
    console.error('Erreur lors du démarrage du serveur:', err);
  }); 