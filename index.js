const express = require('express');
const app = express();
require('dotenv').config;
const cors = require('cors');
// set up port
const PORT = process.env.PORT || 3000;
app.use(express.json());
// allow access to fetch data from the api externally by  Seting header
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
});
app.use(cors({
    origin: ['http://192.168.9.28:8080', 'http://localhost:8080'],
    credentials: true
}));
// add routes
const router = require('./routes/router.js');
app.use(router);
// run server
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));