const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./dataRoutes'); // Import rute data

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parsing JSON payloads

// Rute utama
app.use('/api', dataRoutes); // Menggunakan rute data

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
