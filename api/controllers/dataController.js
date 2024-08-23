// Simulasi data terbaru
let latestData = {
    soilMoisture: 0,
    pumpStatus: false,
    lastWatered: new Date()
};

// Fungsi untuk menangani permintaan POST /api/data
const updateData = (req, res) => {
    const { soilMoisture } = req.body;
    latestData.soilMoisture = soilMoisture;
    latestData.lastWatered = new Date();

    console.log(`Data received: Soil Moisture=${soilMoisture}`);
    res.status(200).send('Data received');
};

// Fungsi untuk menangani permintaan GET /api/latest-data
const getLatestData = (req, res) => {
    res.json(latestData);
};

module.exports = {
    updateData,
    getLatestData
};
