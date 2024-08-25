require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Membuat atau membuka database SQLite
const db = new sqlite3.Database('soil_moisture.db');

// Membuat tabel jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS soil_moisture_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  moisture_level REAL,
  date DATE
)`);

// Data penyimpanan
let latestData = {
  soilMoisture: 0,
  pumpStatus: false,
  lastWatered: new Date(),
  manualOverride: false, // Menambahkan variabel untuk mode manual
  overrideTime: null // Waktu ketika manual override diaktifkan
};

// Fungsi untuk mengendalikan relay berdasarkan status pompa
function controlRelay() {
  if (latestData.pumpStatus) {
    // Gantikan ini dengan perintah yang sesuai untuk menyalakan relay
    console.log('Relay ON (Pompa aktif)');
  } else {
    // Gantikan ini dengan perintah yang sesuai untuk mematikan relay
    console.log('Relay OFF (Pompa nonaktif)');
  }
}

// Fungsi untuk menyimpan data kelembapan ke database
function saveMoistureToDB(soilMoisture) {
  const date = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

  db.run(`INSERT INTO soil_moisture_history (moisture_level, date) VALUES (?, ?)`,
    [soilMoisture, date], function (err) {
      if (err) {
        return console.error('Error saving moisture data to database:', err.message);
      }
      console.log('Moisture data saved to database');
    });
}

// Fungsi untuk memeriksa kelembapan tanah dan mengontrol pompa secara otomatis
function checkSoilMoisture() {
  const { soilMoisture, manualOverride, overrideTime } = latestData;
  const now = new Date();

  // Periksa jika mode manual sedang aktif dan dalam batas waktu override
  if (manualOverride && (now - overrideTime < 60000)) { // 60,000 ms = 1 menit
    console.log(`Pompa diaktifkan secara manual dan tetap menyala. Kelembapan Tanah=${soilMoisture}%`);
    controlRelay(); // Kontrol relay sesuai status pompa
    return;
  }

  // Reset mode manual setelah 1 menit
  latestData.manualOverride = false;

  if (soilMoisture < 30) {
    latestData.pumpStatus = true;
    latestData.lastWatered = new Date(); // Update waktu penyiraman terakhir
    console.log(`Tanah kering. Pompa diaktifkan. Kelembapan Tanah=${soilMoisture}%`);
  } else {
    latestData.pumpStatus = false;
    console.log(`Tanah cukup basah. Pompa dimatikan. Kelembapan Tanah=${soilMoisture}%`);
  }

  controlRelay(); // Kontrol relay sesuai status pompa

  // Simpan kelembapan ke database
  saveMoistureToDB(soilMoisture);
}

// Endpoint POST untuk menerima data dari sensor
app.post('/api/data', (req, res) => {
  const { soilMoisture } = req.body;
  latestData.soilMoisture = soilMoisture;

  // Panggil fungsi untuk memeriksa kelembapan tanah
  checkSoilMoisture();

  res.status(200).send('Data received');
});

// Endpoint GET untuk mendapatkan data terbaru
app.get('/api/latest-data', (req, res) => {
  res.json(latestData);
});

// Endpoint POST untuk mengubah status pompa secara manual
app.post('/api/toggle-pump', (req, res) => {
  const { pumpStatus } = req.body;
  latestData.pumpStatus = pumpStatus;

  // Aktifkan mode manual dan simpan waktu override
  latestData.manualOverride = true;
  latestData.overrideTime = new Date();

  // Kontrol relay sesuai status pompa
  controlRelay();

  console.log(`Status pompa diubah secara manual menjadi: ${pumpStatus ? 'AKTIF' : 'NONAKTIF'}`);
  res.status(200).send('Pump status updated');
});

// Endpoint GET untuk mendapatkan status pompa
app.get('/api/pump-status', (req, res) => {
  res.send(latestData.pumpStatus ? '1' : '0');
});

// Endpoint GET untuk mendapatkan riwayat kelembapan harian
app.get('/api/history', (req, res) => {
  db.all(`SELECT date, AVG(moisture_level) as avg_moisture
          FROM soil_moisture_history
          GROUP BY date`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Mulai server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
