const express = require('express'); //Importe le module Express (framework web pour créer des API)
const path = require('path'); //Importe le module 'path' de Node.js pour gérer les chemins de fichiers
const cors = require('cors'); //Importe le module CORS pour autoriser les appels entre le site web et l'API

const app = express(); //Crée une application Express (le serveur web)
const PORT = 3000; //Définit le port d'écoute du serveur (localhost:3000)

// Middleware
app.use(cors()); //permet d’autoriser les requêtes entre le site web et notre API (/api/tendances) en activant les CORS (Cross-Origin Resource Sharing).
//Sans lui, le navigateur pourrait bloquer les appels API pour "raison de sécurité".

// Servir les fichiers statiques
app.use('/css', express.static(path.join(__dirname, '../CSS')));
app.use('/java', express.static(path.join(__dirname, '../JAVA')));
app.use('/images', express.static(path.join(__dirname, '../Images')));
app.use('/', express.static(path.join(__dirname, '../HTML')));

// Route d'API personnalisée avec données statiques
app.get('/api/tendances', (req, res) => {
    const filmsTendances = [
        {
            id: 1,
            title: "The Dark Knight",
            poster_path: "http://localhost:3000/images/tdk.jpg"
        },
        {
            id: 2,
            title: "Inception",
            poster_path: "http://localhost:3000/images/incep.webp"
        },
        {
            id: 3,
            title: "Interstellar",
            poster_path: "http://localhost:3000/images/inter.jpg"
        }
    ];

    res.json({ resultas: filmsTendances }); // Répond à la requête en envoyant les films au format JSON (format similaire à TMDB)
});

//Démarre le serveur sur le port 3000 et affiche un message dans le terminal
app.listen(PORT, () => {
    console.log(` Serveur en ligne sur http://localhost:${PORT}`);
});
