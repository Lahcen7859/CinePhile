// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./films.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS trending (
      id INTEGER PRIMARY KEY,
      title TEXT,
      poster_path TEXT
    )
  `);

  // Tu peux modifier ici pour ajouter tes propres films
  db.run("DELETE FROM trending"); // Supprime les anciens films pour ne pas dupliquer

  const stmt = db.prepare("INSERT INTO trending (title, poster_path) VALUES (?, ?)");

  stmt.run("Film 1", "/image1.jpg");
  stmt.run("Film 2", "/image2.jpg");
  stmt.run("Film 3", "/image3.jpg");

  stmt.finalize();
});

module.exports = db;
