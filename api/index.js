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

// Endpoint POST untuk menerima data
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

// Endpoint POST untuk mengubah status pompa
app.post('/api/toggle-pump', (req, res) => {
  const { pumpStatus } = req.body;
  latestData.pumpStatus = pumpStatus;
  console.log(`Pump status set to: ${pumpStatus}`);
  res.status(200).send('Pump status updated');
});

// Endpoint GET untuk mendapatkan status pompa
app.get('/api/pump-status', (req, res) => {
  res.send(latestData.pumpStatus ? '1' : '0');
});

// Mulai server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
