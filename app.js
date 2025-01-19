const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const sightRoute = require('./routes/sightRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
const path = require('path');

app.use(cors());
app.use(bodyParser.json()); // Damit Anfragen im JSON-Format verarbeitet werden

// API-Routen einbinden
app.use('/api/sights', sightRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/user', userRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));


// Server starten
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});



