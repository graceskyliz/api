// server.js
const express = require("express");
const db = require("./database");
const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/plants", (req, res) => {
  db.all("SELECT * FROM plants", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/plants/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM plants WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    row ? res.json(row) : res.status(404).json({ message: "Planta no encontrada" });
  });
});

app.post("/plants", (req, res) => {
  const { name, species, watering_frequency } = req.body;
  db.run(
    "INSERT INTO plants (name, species, watering_frequency) VALUES (?, ?, ?)",
    [name, species, watering_frequency],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, species, watering_frequency });
    }
  );
});

app.put("/plants/:id", (req, res) => {
  const { id } = req.params;
  const { name, species, watering_frequency } = req.body;
  db.run(
    "UPDATE plants SET name = ?, species = ?, watering_frequency = ? WHERE id = ?",
    [name, species, watering_frequency, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      this.changes
        ? res.json({ message: "Planta actualizada" })
        : res.status(404).json({ message: "Planta no encontrada" });
    }
  );
});

app.delete("/plants/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM plants WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    this.changes
      ? res.json({ message: "Planta eliminada" })
      : res.status(404).json({ message: "Planta no encontrada" });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});

