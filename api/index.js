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
  latestData.lastWatered = new Date();
  console.log(`Data received: Soil Moisture=${soilMoisture}`);
  res.status(200).send('Data received');
});

// Endpoint GET untuk mendapatkan data terbaru
app.get('/api/latest-data', (req, res) => {
  res.json(latestData);
});

// Endpoint POST untuk toggle status pompa
app.post('/api/toggle-pump', (req, res) => {
  const { pumpStatus: newPumpStatus } = req.body;

  // Update status pompa
  latestData.pumpStatus = newPumpStatus;

  // Kontrol hardware (misalnya menggunakan digitalWrite jika diperlukan)
  if (newPumpStatus) {
    // Aktifkan pompa (misalnya digitalWrite(D1, HIGH))
    console.log('Pompa diaktifkan');
  } else {
    // Nonaktifkan pompa (misalnya digitalWrite(D1, LOW))
    console.log('Pompa dinonaktifkan');
  }

  // Kirimkan respon sukses ke client
  res.json({ success: true, pumpStatus: newPumpStatus });
});

// Mulai server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
