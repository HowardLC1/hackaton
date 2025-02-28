const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("map.db");

app.use(express.json());
app.use(cors());

// Создаем таблицу для хранения меток (если ее нет)
db.run(`CREATE TABLE IF NOT EXISTS placemarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL,
    lon REAL
)`);

// API для сохранения метки
app.post("/addPlacemark", (req, res) => {
    const { lat, lon } = req.body;
    db.run("INSERT INTO placemarks (lat, lon) VALUES (?, ?)", [lat, lon], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// API для получения всех меток
app.get("/getPlacemarks", (req, res) => {
    db.all("SELECT * FROM placemarks", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API для удаления метки
app.delete("/deletePlacemark/:id", (req, res) => {
    db.run("DELETE FROM placemarks WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Запускаем сервер
app.listen(3000, () => console.log("Сервер запущен на http://localhost:3000"));
