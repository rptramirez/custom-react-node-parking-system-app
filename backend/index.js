const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

const parkingRoutes = require('./src/routes/parkingRoutes');

// Mount the router on the app
app.use('/api', parkingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
