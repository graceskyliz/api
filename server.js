// server.js
const express = require("express");
const db = require("./database");
const app = express();
const PORT = 8000;

app.use(express.json());

// 📌 Obtener todos los usuarios
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 📌 Obtener un usuario por ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    row ? res.json(row) : res.status(404).json({ message: "Usuario no encontrado" });
  });
});

// 📌 Crear un usuario
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// 📌 Actualizar un usuario
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    this.changes ? res.json({ message: "Usuario actualizado" }) : res.status(404).json({ message: "Usuario no encontrado" });
  });
});

// 📌 Eliminar un usuario
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    this.changes ? res.json({ message: "Usuario eliminado" }) : res.status(404).json({ message: "Usuario no encontrado" });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
