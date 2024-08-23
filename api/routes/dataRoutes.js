const express = require('express');
const router = express.Router();
const { dataController } = require('../controllers');

// Endpoint untuk menerima data dari perangkat IoT
router.post('/data', dataController.updateData);

// Endpoint untuk mendapatkan data terbaru
router.get('/latest-data', dataController.getLatestData);

module.exports = router;
