// database.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error al abrir la base de datos:", err.message);
  } else {
    console.log("Conectado a SQLite.");

    db.run(`CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        watering_frequency TEXT
      )`);
  }
});

module.exports = db;
