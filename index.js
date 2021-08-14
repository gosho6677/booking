const express = require('express');
const { PORT } = require('./config/index.js');
const expressConfig = require('./config/express.js');
const databaseConfig = require('./config/database.js');
const routesConfig = require('./config/routes.js');
const app = express();

start();

async function start() {
    expressConfig(app);
    await databaseConfig(app);
    routesConfig(app);
}

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/`));