require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Data penyimpanan
let latestData = {
  soilMoisture: 0,
  pumpStatus: false,
  lastWatered: new Date()
};

// Endpoint POST untuk menerima data dari sensor
app.post('/api/data', (req, res) => {
  const { soilMoisture } = req.body;
  latestData.soilMoisture = soilMoisture;
  
  // Logika untuk mengaktifkan atau menonaktifkan pompa berdasarkan kelembapan tanah
  if (soilMoisture < 30) {
    latestData.pumpStatus = true;
    latestData.lastWatered = new Date(); // Update waktu penyiraman terakhir
    console.log(`Tanah kering. Pompa diaktifkan. Kelembapan Tanah=${soilMoisture}%`);
  } else {
    latestData.pumpStatus = false;
    console.log(`Tanah cukup basah. Pompa dimatikan. Kelembapan Tanah=${soilMoisture}%`);
  }

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
  
  // Perbarui waktu penyiraman terakhir jika pompa dihidupkan
  if (pumpStatus) {
    latestData.lastWatered = new Date();
  }

  console.log(`Status pompa diubah secara manual menjadi: ${pumpStatus ? 'AKTIF' : 'NONAKTIF'}`);
  res.status(200).send('Pump status updated');
});

// Endpoint GET untuk mendapatkan status pompa
app.get('/api/pump-status', (req, res) => {
  res.send(latestData.pumpStatus ? '1' : '0');
});

// Mulai server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
